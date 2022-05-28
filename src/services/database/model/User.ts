import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";

export interface IUser {
    id?: number | string;
    name: string;
    username: string;
    email: string;
    roleID?: number;
    password: string;
    companyIDs?: number[];
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
    constructor(user: IUser) {
        if (user.id) this.id = user.id || nanoid(8);
        this.name = user.name;
        this.username = user.username;
        this.email = user.email;
        this.roleID = user.roleID || 1; // default role is 1 i.e. admin
        this.password = user.password;
        this.companyIDs = user.companyIDs || [1]; // default company
        this.loadRole().then((role) => {
            this.role = role;
        });
    }

    async loadRole() {
        const role = await db.roles.get(this.roleID);
        return role;
    };

    addUserToCompany() {
        db.companies.where('id').anyOf([...this.companyIDs]).modify((company) => {
            company.userIDs.push(this.id as number);
        });
    }

    private onCreate(id: string, user: User, tx: Transaction) {
        console.log('USER DB',id , user.companyIDs);
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

        // db.users.hook.creating.subscribe(this.onCreate);

        return db.transaction('rw', db.users, db.roles, db.companies, async (tx) => {
            delete user.role;
            return db.users.orderBy('username').keys(async (usernames) => {
                let usernameExists = usernames.includes(user.username);
                console.log(usernames, user.username);
                console.log(usernameExists);

                if (usernameExists) {
                    // throw new Error("Username already exists");
                    tx.abort();
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

    delete(){
        // db.users.hook.deleting.subscribe(this.onDelete);
        db.transaction('rw', db.users, db.companies, async (tx) => {
            db.users.delete(this.id as number);
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
    email: 'admin@default',
    roleID: 1,
    password: 'admin',
    companyIDs: [1],
})




// Ref : User.companyID > Company.id