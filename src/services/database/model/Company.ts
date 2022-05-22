import db from "../db";

export interface ICompany {
    id?: number;
    name: string;
    address: IAddress;
    contacts: IContact[];
    gst: string;
    email?: string;
    configID? : number;
    lastBackupID?: string;
    lastBackupName?: string;
    lastGSTInvoiceNo : number;
    lastInvoiceNo : number;
    userIDs : number[];
    createdBy?: string;
}

export class Company implements ICompany {
    id?: number;
    name: string;
    address: IAddress;
    contacts: IContact[];
    gst: string;
    email?: string;
    configID? : number;
    lastBackupID?: string;
    lastBackupName?: string;
    lastGSTInvoiceNo : number;
    lastInvoiceNo : number;
    userIDs : number[];
    createdAt: Date;
    createdBy?: string;
    constructor(company: ICompany) {
        if (company.id) this.id = company.id;
        this.name = company.name;
        this.address = company.address;
        this.contacts = company.contacts;
        this.gst = company.gst;
        this.email = company.email;
        this.configID = company.configID;
        this.lastBackupID = company.lastBackupID;
        this.lastBackupName = company.lastBackupName;
        this.lastGSTInvoiceNo = company.lastGSTInvoiceNo || 1;
        this.lastInvoiceNo = company.lastInvoiceNo || 1;
        this.userIDs = company.userIDs;
        this.createdAt = new Date();
        this.createdBy = company.createdBy || "APP DB";
    }

    async save() {
        let company = new Company({...this})
        return db.transaction('rw', db.companies, db.users, db.roles,  async () => {
            const _save =  db.companies.put(company).then(_id => {
                this.id = _id;
                console.log(this.id);
                // create a company database
                return db.createCompanyDB(_id);
            });
            return _save;
        });
    }

    delete() {
        return db.transaction('rw', db.companies, db.users, db.roles, async () => {
            const _delete = db.companies.delete(this.id as number);
            return _delete;
        });
    }
}

// Ref : Company.configID - Config.id

export interface IAddress {
    id?: number;
    address: string;
    city: string;
    state: string;
}

export interface IContact {
    id?: number;
    name: string;
    email?: string;
    phone?: string;
    mobile?: string;
}


export interface ICategory {
    id?: number;
    companyID: number;
    name: string;
}

export const defaultCompany = new Company({
    name: "Company 1",
    address: {
        id: 1,
        address: "Address 1",
        city: "City 1",
        state: "State 1"
    },
    contacts: [
        {
            id: 1,
            name: "Contact 1",
            email: "company1@default",
            phone: "1234567890",
            mobile: "1234567890"
        }
    ],
    gst: "GST 1",
    email: "company1@default",
    configID: 1,
    lastBackupID: "",
    lastBackupName: "",
    lastGSTInvoiceNo: 1,
    lastInvoiceNo: 1,
    userIDs: [1]
})
