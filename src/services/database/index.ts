import Dexie from 'dexie';
import { ICategory, ICompany, IRole, IUser } from './model';
import { User } from './model/User';
class AppDB extends Dexie {

    companyDB : CompanyDB[];
    users! : Dexie.Table<User, number>;
    roles! : Dexie.Table<IRole, number>;
    companies! : Dexie.Table<ICompany, number>;
    categories! : Dexie.Table<ICategory, number>;


    constructor() {
        super('AppDB');
        // Declare tables
        this.version(1).stores({
            roles: '++id, name, permissionIDs',
            companies: '++id, name, email',
            users: '++id, name, username, email, roleID, companyID',
            categories: '++id, companyID, name',
        });
        this.companyDB = [];
        this.users.mapToClass(User);
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
            purchases: '++id, companyID, voucherNo, clientID, date, categoryID',
            invoices: '++id, companyID, voucherNo, clientID, date, categoryID',
            reports : '++id, companyID, name, amount, date, category',
            settings: '++id, companyID, name, value',
        });
    }
}

export default AppDB
