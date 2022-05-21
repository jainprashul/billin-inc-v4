export interface INotificationLog {
    id?: number;
    notificationID : number;
    clientID : number;
    companyID? : number;
    date : Date;
    message : string;
    link? : string;
    status : NotificationStatus;
}

type NotificationStatus = "NEW" | "READ";
