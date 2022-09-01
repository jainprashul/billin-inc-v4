import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import CompanyDB from "../companydb";
import db from "../db";
import { Client } from "./Client";
import { NotificationLog } from "./NotificationLog";

export interface IStockLogs {
    id?: string;
    stockID: string;
    voucherNo: string;
    logType: StockLogType;
    quantity: number;
    rate: number;
    date: Date;
    amount: number;
    companyID: number;
    clientID: string;
    clientName: string;
    client?: Client
}

type StockLogType = "SALE" | "PURCHASE" | "TRANSFER" | "OPENING_STOCK" | "CLOSING_STOCK" | "ADJUSTMENT";

export class StockLog implements IStockLogs {
    id: string;
    stockID: string;
    voucherNo: string;
    logType: StockLogType;
    quantity: number;
    rate: number;
    date: Date;
    amount: number;
    companyID: number;
    clientID: string;
    clientName : string
    client : Client | undefined;

    constructor(stockLogs: IStockLogs) {
        this.id = stockLogs.id || `sl-${nanoid(8)}`;
        this.stockID = stockLogs.stockID;
        this.voucherNo = stockLogs.voucherNo;
        this.logType = stockLogs.logType;
        this.quantity = stockLogs.quantity;
        this.rate = stockLogs.rate;
        this.date = stockLogs.date;
        this.amount = stockLogs.amount;
        this.companyID = stockLogs.companyID;
        this.clientID = stockLogs.clientID;  
        this.clientName = stockLogs.clientName; 
        this.client = stockLogs.client ? new Client({...stockLogs.client}) : undefined;
    }

    async loadClient() {
        const companyDB = db.getCompanyDB(this.companyID)
        const client = await companyDB.clients.get(this.clientID) 
        this.client = client;
    }

    private onCreate(id: string, stockLogs: StockLog, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: stockLogs.companyID,
            clientID: stockLogs.clientID,
            date: new Date(),
            message: `${stockLogs.voucherNo} has been ${stockLogs.logType}`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/stock/${stockLogs.stockID}`
        });
        notify.save();
    }

    private onDelete(id: string, stockLogs: StockLog, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: stockLogs.companyID,
            clientID: stockLogs.clientID,
            date: new Date(),
            message: `${stockLogs.voucherNo} has been ${stockLogs.logType}`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            // link: `/stock/${stockLogs.stockID}`
        });
        notify.save();
    }

    private addtoStock(companyDB: CompanyDB) {
        // update stock logids
        companyDB.stocks.get(this.stockID).then(stock => {
            if (stock) {
                stock.logIDs.add(this.id);
                companyDB.stocks.update(this.stockID, stock);
            }
        });
    }

    private deletefromStock(companyDB: CompanyDB) {
        // update stock logids
        companyDB.stocks.get(this.stockID).then(stock => {
            if (stock) {
                stock.logIDs.delete(this.id);
                companyDB.stocks.update(this.stockID, stock);
            }
        });
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID);
        companyDB.stocklogs.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction("rw", companyDB.stocklogs, companyDB.stocks, companyDB.notificationlogs, async (tx) => {
            try {
                // console.log(companyDB);
                const _save = companyDB.stocklogs.put({ ...this }).then(_id => {
                    console.log('Saved stocklogs', _id);
                    this.id = _id;
                    this.addtoStock(companyDB);
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
        companyDB.stocklogs.hook.deleting.subscribe(this.onDelete);

        return companyDB.transaction("rw", companyDB.stocklogs, companyDB.stocks, companyDB.notificationlogs, async (tx) => {
            try {
                // console.log(companyDB);
                const _delete = companyDB.stocklogs.delete(this.id).then(() => {
                    console.log('Deleted stocklogs', this.id);
                    this.deletefromStock(companyDB);
                    return this.id;
                });
                return _delete;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        });
    }
}