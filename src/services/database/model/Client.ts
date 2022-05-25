import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { IAddress, IContact } from "./Company";
import { NotificationLog } from "./NotificationLog";

export interface IClient {
    id?: string;
    name: string;
    details: string;
    gst: string;
    address: IAddress;
    contacts: IContact[];
    companyID: number;
}

export class Client implements IClient {
    id: string;
    name: string;
    details: string;
    gst: string;
    address: IAddress;
    contacts: IContact[];
    companyID: number;

    constructor(client: IClient) {
        this.id = client.id || `c_${nanoid(8)}`;
        this.name = client.name;
        this.details = client.details;
        this.gst = client.gst;
        this.address = client.address;
        this.contacts = client.contacts;
        this.companyID = client.companyID;
    }

    private onCreate(id: string, client: Client, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: client.companyID,
            clientID: client.id,
            date: new Date(),
            message: `Client ${client.name} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/ledger/${client.id}`
        });
        notify.save();
    }

    private onDelete(id: string, client: Client, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: client.companyID,
            clientID: client.id,
            date: new Date(),
            message: `Client ${client.name} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/ledger/${client.id}`
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        // companyDB.clients.hook("creating", this.onCreate);
        companyDB.clients.hook.creating.subscribe(this.onCreate);
        // console.log(companyDB);
        companyDB.transaction('rw', companyDB.clients, companyDB.notificationlogs, async () => {
            try {
                const _save = companyDB.clients.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log("Client saved", _id);
                    return this.id;
                });
                return _save;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
            }
        });
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.transaction('rw', companyDB.clients, companyDB.notificationlogs, async () => {
            return companyDB.clients.delete(this.id as string).then(() => {
                console.log("Client deleted", this.id);
                return this.id;
            });
        })
        companyDB.clients.hook("deleting", this.onDelete);
    }
}