import db from "../db";

export interface INotificationLog {
    id?: number;
    notificationID: string;
    clientID : string;
    companyID : number;
    date : Date;
    message : string;
    link? : string;
    status : NotificationStatus;
}

type NotificationStatus = "NEW" | "READ";

export class NotificationLog implements INotificationLog {
    id?: number;
    notificationID: string;
    clientID : string;
    companyID : number;
    date : Date;
    message : string;
    link? : string;
    status : NotificationStatus;

    constructor(notificationLog: INotificationLog) {
        if (notificationLog.id) this.id = notificationLog.id;
        this.notificationID = notificationLog.notificationID;
        this.clientID = notificationLog.clientID;
        this.companyID = notificationLog.companyID;
        this.date = notificationLog.date;
        this.message = notificationLog.message;
        this.link = notificationLog.link;
        this.status = notificationLog.status;
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)

        companyDB.transaction('rw', companyDB.notificationlogs, (tx) => {
            try{
                const _save = companyDB.notificationlogs.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log('Notification Created',this.id);
                    return this.id;
                });
                return _save;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        })
    }

    deleteAll() {
        const companyDB = db.getCompanyDB(this.companyID)

        companyDB.transaction('rw', companyDB.notificationlogs, (tx) => {
            try{
                const _delete = companyDB.notificationlogs.clear().then(_id => {
                    console.log('All Notification Deleted');
                });
                return _delete;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        })
    }
}
