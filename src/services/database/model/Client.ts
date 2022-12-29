import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { IAddress, IContact } from "./Company";
import { NotificationLog, NotificationType } from "./NotificationLog";
import * as Yup from 'yup';
import { objDiff} from '../../../utils'
import authService from "../../authentication/auth.service";
export interface IClient {
    id?: string;
    name: string;
    details: string;
    gst: string;
    address: IAddress;
    contacts: IContact[];
    companyID: number;
    isCustomer? : boolean;
    createdAt?: Date;
}

export class Client implements IClient {
    id: string;
    name: string;
    details: string;
    gst: string;
    address: IAddress;
    contacts: IContact[];
    companyID: number;
    isCustomer : boolean;
    createdAt: Date;
    updatedAt: Date;

    constructor(client: IClient) {
        this.id = client.id || `c_${nanoid(8)}`;
        this.name = client.name;
        this.details = client.details;
        this.gst = client.gst;
        this.address = client.address;
        this.contacts = client.contacts;
        this.companyID = client.companyID;
        this.isCustomer = client.isCustomer ?? true;
        this.createdAt = client.createdAt || new Date();
        this.updatedAt = new Date();
    }

    static validationSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        address: Yup.object().shape({
            address: Yup.string().required('Address is required'),
            city: Yup.string().required('City is required'),
            state: Yup.string().required('State is required'),
        }),
        contacts: Yup.array().of(Yup.object().shape({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email'),
            phone: Yup.string().required('Phone is required'),
            mobile: Yup.string(),
        })).min(1, 'At least one contact is required'),
    });


    private onCreate(id: string, client: Client, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: client.companyID,
            clientID: client.id,
            date: new Date(),
            message: `Client ${client.name} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            type: NotificationType.CLIENT,
            link: `/ledger/${client.id}`,
            isVisible: true,
            createdBy : authService.getUser()?.name || 'System',
        });
        notify.save();
    }

    private onUpdate(changes : Partial<Client>, id: string, client: Client, tx: Transaction) {
        const diff = objDiff(changes, client);
        console.log('Client updated: ', diff);
        const notify = new NotificationLog({
            companyID: client.companyID,
            clientID: client.id,
            date: new Date(),
            message: `Client ${client.name} updated`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            type: NotificationType.CLIENT,
            changes: diff,
            link: `/ledger/${client.id}`,
            isVisible: true,
            createdBy : authService.getUser()?.name || 'System',
        });
        notify.save();
    }

    private onDelete(id: string, client: Client, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: client.companyID,
            clientID: client.id,
            date: new Date(),
            message: `Client ${client.name} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            type: NotificationType.CLIENT,
            link: `/ledger/${client.id}`,
            isVisible: true,
            createdBy : authService.getUser()?.name || 'System',
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.clients.hook.creating.subscribe(this.onCreate);
        companyDB.clients.hook.updating.subscribe(this.onUpdate);
        return companyDB.transaction('rw', companyDB.clients, companyDB.notificationlogs, async (tx) => {
            try {
                this.updatedAt = new Date();
                const _save = companyDB.clients.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log("Client saved", _id);
                    return this.id;
                });
                return _save;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        });
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.clients.hook("deleting", this.onDelete);

        return companyDB.transaction('rw', companyDB.clients, companyDB.notificationlogs, async () => {
            return companyDB.clients.delete(this.id as string).then(() => {
                console.log("Client deleted", this.id);
                return this.id;
            });
        })
    }
}