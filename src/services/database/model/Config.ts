// app config

export interface IConfig {
    id?: number;
    appExpired: boolean
    expiryDate: Date
    gstEnabled: boolean
    lastBackupID: string
    lastOnlineBackupDate: Date
    lisenseKey?: string
    lisenseType?: string
    lisenseValid: boolean
    lisenseValidDate?: Date
    lisenseValidTill?: Date
    lisenseVersion?: string
    lisenseeName?: string
    whatsappEnabled: boolean
    scheduleBackup: ISchedule
    companyID: number
}

interface ISchedule {
    id?: number;
    enabled: boolean
    backupDuration: Date
}