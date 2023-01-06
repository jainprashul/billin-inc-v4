import { IUser, Usr } from "../database/model";
class AuthService {
    async login(username: string, password: string, remember = false) {
        const resp = await window.fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        })
        const data = await resp.json();
        if (data.token) {
            if (remember) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
            } else {
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('user', JSON.stringify(data));
            }
            return data;
        } else {
            throw new Error(data.message);
        }
    }

    async register(user: IUser) {
        const resp = await window.fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
        const data = await resp.json();
        if (data.token) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            return data;
        } else {
            throw new Error(data.message)
        }
       
    }

    async logout(redirect = '/') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = redirect;
    }
    
    getUser() {
        const res = localStorage.getItem('user') || sessionStorage.getItem('user');
        const user : Usr | null = res ? JSON.parse(res) : null;
        return user;
    }

    getToken() {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    async getAllUsers() {
        const resp = await window.fetch('/api/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + this.getToken()
            },
        })
        const users = await resp.json();
        console.log(users);
        return users;
    }

}
export default new AuthService();
