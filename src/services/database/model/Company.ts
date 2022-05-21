export interface ICompany {
    id?: number;
    name: string;
    address: IAddress;
    contact: IContact[];
    gst: string;
    email?: string;
    configID : number;
    lastBackupID?: string;
    lastBackupName?: string;
    lastGSTInvoiceNo : number;
    lastInvoiceNo : number;
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
