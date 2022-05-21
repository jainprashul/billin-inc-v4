import Dexie from 'dexie';
class AppDB extends Dexie {

    companyDB : CompanyDB[];
    users! : Dexie.Table<IUser, number>;

    constructor() {
        super('AppDB');
        // Declare tables
        this.version(1).stores({
            users: '++id, name, username, email, role',
            companies: '++id, name, email',
            roles: '++id, name, permissionIDs',
            categories: '++id, companyID, name',
            permissions: '++id, name',
        });
        this.companyDB = [];
    }

    getCompanyDB(companyID : number) : CompanyDB {
        return this.companyDB[companyID];
    }

    createCompanyDB(companyID : number) : CompanyDB {
        let newDB = new CompanyDB(companyID.toString());
        this.companyDB[companyID] = newDB;
        return newDB;
    }

}


class CompanyDB extends Dexie {
    constructor(dbID: string) {
        super(`company${dbID}`);
        // Declare tables
        this.version(1).stores({
            expenses: '++id, companyID, name, amount, date, categoryID',
            stocks: '++id, companyID, name, quantity, price, date',
            ledger: '++id, companyID, assetID, clientID, amount, date, categoryID',
            purchases: '++id, companyID, voucherNo, clientID, amount, date, categoryID',
            invoices: '++id, companyID, voucherNo, clientID, amount, date, categoryID',
            reports : '++id, companyID, name, amount, date, category',
            settings: '++id, companyID, name, value',
        });
    }
}

export interface IUser {
    id?: number;
    name: string;
    username: string;
    email: string;
    role: string;
    companyID: number[];
}

export interface ICompany {
    id?: number;
    name: string;
    address: IAddress;
    contact: string;
    email: string;
    gst: string;
}

export interface IAddress {
    id?: number;
    address: string;
    city: string;
    state: string;
}

export interface IRole {
    id?: number;
    name: string;
    permissionIDs: number[];
}

export interface ICategory {
    id?: number;
    companyID: number;
    name: string;
}

export interface IPermission {
    id?: number;
    name: string;
}


