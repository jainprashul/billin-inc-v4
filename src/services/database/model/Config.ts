import moment from "moment";
import db from "../db";

export interface IConfig {
    id?: number;
    appExpired: boolean
    expiryDate: Date
    lastBackupID: string
    lastOnlineBackupDate: Date
    lisenseKey?: string
    lisenseType?: string
    lisenseValid: boolean
    lisenseValidationDate?: Date
    lisenseValidTill?: Date
    lisenseVersion?: string
    lisenseeName?: string
    settings?: ISettings
    whatsappEnabled: boolean
    scheduleBackup: ISchedule
    firstTime?: boolean;
    companyID: number
}
interface ISchedule {
    id?: number;
    enabled: boolean
    backupDuration: Date
}

interface ISettings {
    [key: string]: any
}

export class Config implements IConfig {
    id?: number;
    appExpired: boolean
    expiryDate: Date
    lastBackupID: string
    lastOnlineBackupDate: Date
    lisenseKey?: string
    lisenseType?: string
    lisenseValid: boolean
    lisenseValidationDate?: Date
    lisenseValidTill?: Date
    lisenseVersion?: string
    lisenseeName?: string
    whatsappEnabled: boolean
    scheduleBackup: ISchedule
    firstTime: boolean;
    settings: ISettings
    companyID: number

    constructor(config: IConfig) {
        this.id = config.id;
        this.appExpired = config.appExpired;
        this.expiryDate = config.expiryDate;
        this.lastBackupID = config.lastBackupID;
        this.lastOnlineBackupDate = config.lastOnlineBackupDate;
        this.lisenseKey = config.lisenseKey;
        this.lisenseType = config.lisenseType;
        this.lisenseValid = config.lisenseValid;
        this.lisenseValidationDate = config.lisenseValidationDate;
        this.lisenseValidTill = config.lisenseValidTill;
        this.lisenseVersion = config.lisenseVersion;
        this.lisenseeName = config.lisenseeName;
        this.whatsappEnabled = config.whatsappEnabled;
        this.scheduleBackup = config.scheduleBackup;
        this.companyID = config.companyID;
        this.settings = config.settings || {};
        this.firstTime = config.firstTime || true;
    }

    async save() {
        return db.transaction('rw', db.config, async (tx) => {
            return await db.config.put({ ...this });
        });
    }

    async update() {
        return db.transaction('rw', db.config, async (tx) => {
            return await db.config.update(this.id!, this);
        });
    }

    async updateSettings(settings : ISettings) {
        return db.transaction('rw', db.config, async (tx) => {
            return await db.config.update(this.id!, { settings: { ...this.settings, ...settings }});
        });
    }
}

export const defaultConfig = new Config({
    appExpired: false,
    expiryDate: moment().add(2, 'month').toDate(),
    lastBackupID: '',
    lastOnlineBackupDate: new Date(),
    lisenseValid: false,
    whatsappEnabled: false,
    scheduleBackup: {
        enabled: false,
        backupDuration: new Date()
    },
    settings : {
        "gstEnabled": false,
        "gstRateInclusive": true,
    },
    companyID: 1,
    id: 1
});