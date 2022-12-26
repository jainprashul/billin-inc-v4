import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";
import * as Yup from 'yup';

export interface IUser {
    id?: number | string;
    name: string;
    username: string;
    email: string;
    roleID?: number;
    password: string;
    companyIDs?: number[];
    createdAt?: Date;
}

export interface Usr {
    id: number,
    name: string,
    username: string,
    email: string,
    roleID: number,
    token: string,
    companyIDs: number[]
} 

interface IPermission {
    id?: number;
    name: string;
    description?: string;
}

export interface IRole {
    id?: number;
    name: string;
    permissionIDs: IPermission[];
}

export class User implements IUser {
    id?: number | string;
    name: string;
    username: string;
    email: string;
    roleID: number;
    role: IRole | undefined;
    password: string;
    companyIDs: number[];
    createdAt: Date;
    updatedAt: Date;

    constructor(user: IUser) {
        if (user.id) this.id = user.id || nanoid(8);
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.roleID = user.roleID || 1; // default role is 1 i.e. admin
        this.password = user.password;
        this.companyIDs = user.companyIDs || [1]; // default company
        this.createdAt = user.createdAt || new Date();
        this.updatedAt = new Date();
        this.loadRole();

        Object.defineProperty(this, 'role', {
            enumerable: false,
            // configurable: false, 
        });
    }

    static validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    async loadRole() {
        const role = await db.roles.get(this.roleID);
        this.role = role;
        return role;
    };

    private addUserToCompany() {
        db.companies.where('id').anyOf([...this.companyIDs]).modify((company) => {
            company.userIDs.add(this.id as number);
        });
    }

    private onCreate(id: string, user: User, tx: Transaction) {
        console.log('USER DB', id, user.companyIDs);
        user.companyIDs.forEach((companyID) => {
            try {
                const notify = new NotificationLog({
                    companyID,
                    clientID: `usr_${user.username}`,
                    date: new Date(),
                    message: `User ${user.username} created`,
                    notificationID: `ntf-${nanoid(8)}`,
                    status: "NEW",
                });
                notify.save();
            } catch (error) {
                console.log('DB Does not exist \n', error);
            }
        });
    }

    private onDelete(id: string, user: User, tx: Transaction) {
        user.companyIDs.forEach((companyID) => {
            try {
                const notify = new NotificationLog({
                    companyID,
                    clientID: `usr_${user.username}`,
                    date: new Date(),
                    message: `User ${user.username} deleted`,
                    notificationID: `ntf-${nanoid(8)}`,
                    status: "NEW",
                });
                notify.save();
            } catch (error) {
                console.log('DB Does not exist \n', error);
            }
        });
    }
    private onUpdate(_: any , id: string, user: User, tx: Transaction) {
        user.companyIDs.forEach((companyID) => {
            try {
                const notify = new NotificationLog({
                    companyID,
                    clientID: `usr_${user.username}`,
                    date: new Date(),
                    message: `User ${user.username} updated`,
                    notificationID: `ntf-${nanoid(8)}`,
                    status: "NEW",
                });
                notify.save();
            } catch (error) {
                console.log('DB Does not exist \n', error);
            }
        });
    }

    async save() {
        let user = new User({
            id: this.id,
            name: this.name,
            username: this.username,
            email: this.email,
            roleID: this.roleID,
            password: this.password,
            companyIDs: this.companyIDs
        });

        db.users.hook.creating.subscribe(this.onCreate);
        return db.transaction('rw', db.users, db.roles, db.companies, async (tx) => {
            // delete user.role;

            return db.users.orderBy('username').keys(async (usernames) => {
                let usernameExists = usernames.includes(user.username);
                console.log(usernames, user.username);
                console.log(usernameExists);

                if (usernameExists) {
                    tx.abort();
                    throw new Error("Username already exists");
                }
                const _id = await db.users.put(user);
                this.id = _id;
                this.addUserToCompany();
                console.log(`User ${this.name} saved successfully`);
                return this.id;
            });

        }).catch((err) => {
            console.log(err);
            throw new Error(err);
        });
    }

    async update() {
        db.users.hook.updating.subscribe(this.onUpdate);
        return db.transaction('rw', db.users, db.roles, db.companies, async (tx) => {
            this.updatedAt = new Date();
            const _id = await db.users.update(this.id as number, this);
            this.id = _id;
            this.addUserToCompany();
            console.log(`User ${this.name} updated successfully`);
            return this.id;
        });
    }


    delete() {
        db.users.hook.deleting.subscribe(this.onDelete);
        return db.transaction('rw', db.users, db.companies, async (tx) => {
            db.users.delete(this.id as number);
            return this.id;
        });
        
    }
}


// example of a Admin Role
export const AdminRole: IRole = {
    id: 1,
    name: 'Administrator ',
    permissionIDs: [
        {
            id: 1,
            name: "create"
        },
        {
            id: 2,
            name: "read"
        },
        {
            id: 3,
            name: "update"
        },
        {
            id: 4,
            name: "delete"
        }
    ]
}

// example of a User Role
export const UserRole: IRole = {
    id: 2,
    name: 'UserDefault',
    permissionIDs: [
        {
            id: 1,
            name: "create"
        },
        {
            id: 2,
            name: "read"
        },
        {
            id: 3,
            name: "update"
        }
    ]
}

export const defaultUser = new User({
    id: 1,
    name: 'Admin',
    username: 'admin',
    email: 'admin@billing.inc',
    roleID: 1,
    password: 'admin123',
    companyIDs: [1],
})




// Ref : User.companyID > Company.id