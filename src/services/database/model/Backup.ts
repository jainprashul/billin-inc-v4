import db from "../db";

export interface IBackup {
    id?: number;
    name: string;
    date: Date;
    backupID: string;
}

export class Backup implements IBackup {
    id?: number;
    name: string;
    date: Date;
    backupID: string;
    constructor(backup: IBackup) {
        if (backup.id) this.id = backup.id;
        this.name = backup.name;
        this.date = backup.date;
        this.backupID = backup.backupID;
    }

    async save() {
        let backup = new Backup({ ...this })
        return db.transaction('rw', db.backups, async () => {
            const _save = db.backups.put(backup).then(_id => {
                backup.id = _id;
                return backup;
            });
            return _save;
        });
    }
}