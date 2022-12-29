import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import { objDiff } from "../../../utils";
import authService from "../../authentication/auth.service";
import db from "../db";
import { NotificationLog, NotificationType } from "./NotificationLog";
import { StockLog } from "./StockLogs";

export interface IStocks {
    id?: string;
    name: string;
    description?: string;
    quantity: number;
    salesPrice: number;
    purchasePrice: number;
    stockValue: number;
    gstRate: number;
    logIDs: Set<string>;
    companyID: number;
    hsn : string;
    unit : string;
    stockLogs? : StockLog[];
    createdAt?: Date;
}

// Ref : Stocks.logID > StockLogs.id
// Ref : Stocks.name - Product.name
// Ref : StockLogs.clientID - Client.id

export class Stock implements IStocks {
    id: string;
    name: string;
    description?: string;
    quantity: number;
    salesPrice: number;
    purchasePrice: number;
    stockValue: number;
    gstRate: number;
    logIDs: Set<string>;
    companyID: number;
    stockLogs: StockLog[];
    hsn : string;
    unit : string;

    createdAt: Date;
    updatedAt: Date;

    constructor(stock: IStocks) {
        this.id = stock.id || `stk_${nanoid(8)}`
        this.name = stock.name;
        this.description = stock.description;
        this.quantity = stock.quantity;
        this.salesPrice = stock.salesPrice;
        this.purchasePrice = stock.purchasePrice;
        this.stockValue = stock.stockValue;
        this.gstRate = stock.gstRate;
        this.logIDs = stock.logIDs;
        this.companyID = stock.companyID;
        this.hsn = stock.hsn;
        this.unit = stock.unit;
        this.stockLogs = stock.stockLogs ? stock.stockLogs.map(log => new StockLog(log)) : [];
        // this.loadStockLogs();
        this.createdAt = stock.createdAt || new Date();
        this.updatedAt = new Date();

        Object.defineProperty(this, 'stockLogs', {
            enumerable: false,
        });
    }

    async loadStockLogs() {
        const companyDB = db.getCompanyDB(this.companyID)
        const logs = await companyDB.stocklogs.where('stockID').equals(this.id).toArray();
        this.stockValue = logs.reduce((acc, log) => acc + log.amount, 0);
        this.stockLogs = logs;
    }

    private onCreate(id: number, stock: Stock, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: stock.companyID,
            clientID: `${stock.name}_${stock.id}`,
            date: new Date(),
            message: `${stock.name} has been added`,
            notificationID: `ntf-${nanoid(8)}`,
              status: "NEW",  createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.STOCK,
            link: `/stocks/${stock.id}`,
            isVisible: true
        });
        notify.save();
    }

    private onDelete(id: number, stock: Stock, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: stock.companyID,
            clientID: `${stock.name}_${stock.id}`,
            date: new Date(),
            message: `${stock.name} has been removed`,
            notificationID: `ntf-${nanoid(8)}`,
              status: "NEW",  createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.STOCK,
            link: `/stocks/${stock.id}`,
            isVisible: true
        });
        notify.save();
    }

    private onModify(change: Partial<Stock>, id: number, stock: Stock, tx: Transaction) {
        const diff = objDiff(change, stock);
        console.log('Stock modified', diff);
        const notify = new NotificationLog({
            companyID: stock.companyID,
            clientID: `${stock.name}_${stock.id}`,
            date: new Date(),
            message: `${stock.name} has been modified`,
            notificationID: `ntf-${nanoid(8)}`,
              status: "NEW",  createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.STOCK,
            changes: diff,
            link: `/stocks/${stock.id}`,
            isVisible: true
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.stocks.hook.creating.subscribe(this.onCreate);
        companyDB.stocks.hook.updating.subscribe(this.onModify);
        return companyDB.transaction('rw', companyDB.stocks, companyDB.stocklogs, companyDB.notificationlogs, (tx) => {
            try {
                this.updatedAt = new Date();
                const _save = companyDB.stocks.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log('Stock saved successfully.', _id);
                    this.logIDs.forEach(logID => {
                        companyDB.stocklogs.update(logID, { stockID: this.id });
                    });
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
        companyDB.stocks.hook.deleting.subscribe(this.onDelete);
        return companyDB.transaction('rw', companyDB.stocks, companyDB.stocklogs, companyDB.notificationlogs, (tx) => {
            try {
                const _delete = companyDB.stocks.delete(this.id).then(_id => {
                    // companyDB.stocklogs.bulkDelete(Array.from(this.logIDs));
                });
                return _delete;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        });
    }
}