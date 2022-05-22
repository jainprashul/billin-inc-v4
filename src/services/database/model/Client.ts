import db from "../db";
import { IAddress, IContact } from "./Company";

export interface IClient {
    id?: number;
    name : string;
    details : string;
    gst : string;
    address : IAddress;
    contacts : IContact[];
    companyID : number;
}

export class Client implements IClient {
    id?: number;
    name : string;
    details : string;
    gst : string;
    address : IAddress;
    contacts : IContact[];
    companyID: number;

    constructor(client: IClient) {
        if (client.id) this.id = client.id;
        this.name = client.name;
        this.details = client.details;
        this.gst = client.gst;
        this.address = client.address;
        this.contacts = client.contacts;
        this.companyID = client.companyID;
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        // console.log(companyDB);
        const _save = companyDB.clients.put({...this}).then(_id => {
            this.id = _id;
            console.log(this.id);
            return this.id;
        });
        return _save;
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.clients.delete(this.id as number);
    }
}