import Dexie from 'dexie';
import CompanyDB from './companydb';
import { Company, ICategory, IRole, User, Config, Backup } from './model';

class AppDB extends Dexie {

    companyDB: { [key: string]: CompanyDB }
    users!: Dexie.Table<User, number>;
    roles!: Dexie.Table<IRole, number>;
    companies!: Dexie.Table<Company, number>;
    categories!: Dexie.Table<ICategory, number>;
    backups!: Dexie.Table<Backup, number>;
    config!: Dexie.Table<Config, number>;

    constructor() {
        super('BILLIN_DB');
        // Declare tables
        this.version(1.2).stores({
            roles: '++id, name, permissionIDs',
            companies: '++id, name, email',
            users: '++id, name, &username, &email, roleID, companyID',
            categories: '++id, companyID, name',
            backups : '++id, backupID, date',
            config : '++id, companyID'
        });
        this.companyDB = {};
        this.loadCompanyDBs();

        this.users.mapToClass(User);
        this.companies.mapToClass(Company);
        this.config.mapToClass(Config);
        this.backups.mapToClass(Backup);

        this.on('versionchange').subscribe((event) => {
            console.log('versionchange', event);
        });
    }

    getCompanyDB(companyID: number): CompanyDB {
        let dbname = `Company_${companyID}`
        return this.companyDB[dbname];
    }

    async loadCompanyDBs() {
        const companies = await this.companies.toArray();
        companies.forEach((company) => {
            let dbname = `Company_${company.id}`
            let cDB = new CompanyDB(dbname);
            this.companyDB[dbname] = cDB;
        });
    }

    createCompanyDB(companyID: number): CompanyDB {
        // console.log('createCompanyDB', companyID);
        let dbname = `Company_${companyID}`
        let newDB = new CompanyDB(dbname);
        newDB.on('populate', () => {
            console.log('populate', dbname);
        });
        this.companyDB[dbname] = newDB;
        // console.log(this.companyDB);

        return newDB;
    }
}

export default AppDB
