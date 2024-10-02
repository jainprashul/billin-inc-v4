import db from "../database/db";
import { User } from "../database/model";
import * as jose from "jose";

const secret = new TextEncoder().encode(import.meta.env.REACT_APP_JWT_SECRET as string);

// Act as a proxy to the authentication service
export const configBackEnd = () => {
    const realFetch = window.fetch;
    console.log('configBackEnd');

    window.fetch = function (url, opts) {
        const URL = url as string
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(async () => {
                // authenticate
                if (URL.endsWith('/api/login') && opts?.method === 'POST') {
                    // get parameters from post request
                    const params = JSON.parse(opts.body as string);

                    // find if any user matches login credentials
                    const filteredUsers = await db.users.filter(user => {
                        return user.username === params.username
                    }).first();

                    if (filteredUsers) {
                        // check password
                        if(filteredUsers.password !== params.password) {
                            return ok({ message: 'Password is incorrect' }, 400);
                        }

                        // if login details are valid return user details and fake jwt token
                        const responseJson: Partial<User> = {
                            ...filteredUsers,
                        }
                        delete responseJson.password;
                        const token = await generateToken(responseJson);
                        return ok({
                            ...responseJson,
                            token
                        });

                    } else {
                        return failed({ message: 'Username or password is incorrect' }, 400);
                    }
                }

                // register user
                if (URL.endsWith('/api/register') && opts?.method === 'POST') {
                   try {
                     // get new user object from post body
                     const newUser = JSON.parse(opts.body as string);
                     const user = new User({
                         ...newUser,
                     })
 
                     await user.save()
 
                     console.log('user', user);
 
                     // return user with token
                     const responseJson: Partial<User> = {
                         ...user,
                     }
                     delete responseJson.password;
                     const token = await generateToken(responseJson);
                     return ok({
                         ...responseJson,
                         token
                     });
                   } catch (error :any) {
                        console.error('error', error);
                        console.log();
                        return failed({ message: error.message }, 400);
                   }
                }


                // get users
                if (URL.endsWith('/api/users') && opts?.method === 'GET') {
                    // check for fake auth token in header and return users if valid
                    console.log('opts', opts);
                    try {
                        const user = await verifyToken(opts.headers);
                        if (user) {
                            const users = await db.users.toArray();
                            return ok(users);
                        } else {
                            return unauthorized();
                        }
                    } catch (error) {
                        return unauthorized();
                    }
                }

                // pass through any requests not handled above
                realFetch(url, opts).then(response => resolve(response));
            }, 500);

            // call fetch with the url and options object
            function ok(body: any, status: number = 200) {
                const response = new Response(JSON.stringify(body), { status, statusText: 'OK', headers: { 'Content-Type': 'application/json' } });
                resolve(response);
            }
            function failed(body: any, status: number = 400) {
                const response = new Response(JSON.stringify(body), { status, statusText: 'Bad Request', headers: { 'Content-Type': 'application/json' } });
                resolve(response);
            }
            function unauthorized() {
                const response = new Response(JSON.stringify({ message: 'Unauthorised' }), { status: 401, statusText: 'Unauthorised', headers: { 'Content-Type': 'application/json' } });
                reject(response);
            }
        });
    }
}

async function generateToken(obj: any) {
    return await new jose.SignJWT(obj)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .setIssuedAt()
        .setIssuer('PROD')
        .setAudience('PROD')
        .sign(secret)
}

async function verifyToken(headers: any) {
    const token = headers['Authorization']?.split(' ')[1];
    if (!token) {
        throw new Error('No token provided');
    }
    const {
        payload
    } = await jose.jwtVerify(token, secret, {
        issuer: 'PROD',
        audience: 'PROD',
    })

    return payload;
}