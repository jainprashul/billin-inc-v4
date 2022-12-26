import db from "../database/db";
import { User } from "../database/model";
import * as jose from "jose";

const secret = new TextEncoder().encode(process.env.REACT_APP_JWT_SECRET as string);

// Act as a proxy to the authentication service
export const configBackEnd = () => {
    let realFetch = window.fetch;
    console.log('configBackEnd');

    window.fetch = function (url, opts) {
        let URL = url as string
        return new Promise((resolve, reject) => {
            // wrap in timeout to simulate server api call
            setTimeout(async () => {
                // authenticate
                if (URL.endsWith('/api/login') && opts?.method === 'POST') {
                    // get parameters from post request
                    let params = JSON.parse(opts.body as string);

                    // find if any user matches login credentials
                    let filteredUsers = await db.users.filter(user => {
                        return user.username === params.username
                    }).first();

                    if (filteredUsers) {
                        // check password
                        if(filteredUsers.password !== params.password) {
                            return ok({ message: 'Password is incorrect' }, 400);
                        }

                        // if login details are valid return user details and fake jwt token
                        let responseJson: Partial<User> = {
                            ...filteredUsers,
                        }
                        delete responseJson.password;
                        let token = await generateToken(responseJson);
                        return ok({
                            ...responseJson,
                            token
                        });

                    } else {
                        return ok({ message: 'Username or password is incorrect' }, 400);
                    }
                }

                // register user
                if (URL.endsWith('/api/register') && opts?.method === 'POST') {
                    // get new user object from post body
                    let newUser = JSON.parse(opts.body as string);
                    const user = new User({
                        ...newUser,
                    })

                    user.save()

                    console.log('user', user);

                    // return user with token
                    let responseJson: Partial<User> = {
                        ...user,
                    }
                    delete responseJson.password;
                    let token = await generateToken(responseJson);
                    return ok({
                        ...responseJson,
                        token
                    });
                }


                // get users
                if (URL.endsWith('/api/users') && opts?.method === 'GET') {
                    // check for fake auth token in header and return users if valid
                    console.log('opts', opts);
                    try {
                        let user = await verifyToken(opts.headers);
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