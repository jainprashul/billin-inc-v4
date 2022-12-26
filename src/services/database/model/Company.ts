import db from "../db";

export interface ICompany {
    id?: number;
    name: string;
    address: IAddress;
    contacts: IContact[];
    gst: string;
    email?: string;
    configID?: number;
    lastBackupID?: string;
    lastBackupName?: string;
    lastGSTInvoiceNo: number;
    lastInvoiceNo: number;
    lastPurchaseNo : number;
    lastGSTPurchaseNo : number;
    userIDs: Set<number>;
    createdBy?: string;
    createdAt?: Date;
}

export class Company implements ICompany {
    id?: number;
    name: string;
    address: IAddress;
    contacts: IContact[];
    gst: string;
    email?: string;
    configID?: number;
    lastBackupID?: string;
    lastBackupName?: string;
    lastGSTInvoiceNo: number;
    lastInvoiceNo: number;
    lastPurchaseNo : number;
    lastGSTPurchaseNo : number;
    userIDs: Set<number>;
    createdAt: Date;
    createdBy?: string;
    updatedAt: Date;
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
        this.lastGSTInvoiceNo = company.lastGSTInvoiceNo ?? 0;
        this.lastInvoiceNo = company.lastInvoiceNo ?? 0;
        this.lastPurchaseNo = company.lastPurchaseNo ?? 0;
        this.lastGSTPurchaseNo = company.lastGSTPurchaseNo ?? 0;
        this.userIDs = company.userIDs;
        this.createdAt = company.createdAt || new Date();
        this.createdBy = company.createdBy ?? "APP DB";
        this.updatedAt = new Date();
    }

    async save() {
        let company = new Company({ ...this })
        return db.transaction('rw', db.companies, db.users, db.roles, async () => {
            company.updatedAt = new Date();
            const _save = db.companies.put(company).then(_id => {
                this.id = _id;
                console.log('Company Saved', this.id);
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
    name?: string;
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
    lastGSTInvoiceNo: 0,
    lastInvoiceNo: 0,
    lastPurchaseNo: 0,
    lastGSTPurchaseNo: 0,
    userIDs: new Set([1]),
})
