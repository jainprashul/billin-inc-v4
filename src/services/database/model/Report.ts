import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import authService from "../../authentication/auth.service";
import db from "../db";
import { NotificationLog, NotificationType } from "./NotificationLog";

export interface IReport {
    id?: number;
    companyID: number;
    type : string;
    from : Date;
    to : Date;
    data : any;
    createdAt?: Date
}

export class Report implements IReport {
    id?: number;
    companyID: number;
    type : string;
    from : Date;
    to : Date;
    data : any;
    createdAt: Date;
    updatedAt: Date;
    constructor(report: IReport) {
        if (report.id) this.id = report.id;
        this.companyID = report.companyID;
        this.type = report.type;
        this.from = report.from;
        this.to = report.to;
        this.data = report.data;
        this.createdAt =  report.createdAt || new Date();
        this.updatedAt = new Date();
    }

    private onCreate(id: number, report: Report, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: report.companyID,
            clientID: `${report.type}_${report.id}`,
            date: new Date(),
            message: `${report.type} ${report.from.toLocaleDateString()}- ${report.to.toLocaleDateString()} has been added`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",  
            createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.REPORT,
            action: 'CREATE',
            isVisible: false
        });
        notify.save();
    }

    private onUpdate(change: Partial<Report>, id: number, report: Report, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: report.companyID,
            clientID: `${report.type}_${report.id}`,
            date: new Date(),
            message: `${report.type} ${report.from.toLocaleDateString()}- ${report.to.toLocaleDateString()} has been updated`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.REPORT,
            action: 'UPDATE',
            isVisible: false
        });
        notify.save();
    }

    async save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.reports.hook.creating.subscribe(this.onCreate);
        companyDB.reports.hook.updating.subscribe(this.onUpdate);

        return companyDB.transaction('rw', companyDB.reports, companyDB.notificationlogs, async (tx) => {
            try {
                this.updatedAt = new Date();
                const _save = await companyDB.reports.put(this);
                this.id = _save;
                console.log('Report Created', this.id);

            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        });
    }

}