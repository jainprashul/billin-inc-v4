import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";
import { StockLog } from "./StockLogs";

export interface IStocks {
    id?: string;
    name: string;
    quantity: number;
    salesPrice: number;
    purchasePrice: number;
    stockValue: number;
    gstRate: number;
    logIDs: Set<string>;
    companyID: number;
}

// Ref : Stocks.logID > StockLogs.id
// Ref : Stocks.name - Product.name
// Ref : StockLogs.clientID - Client.id

export class Stock implements IStocks {
    id: string;
    name: string;
    quantity: number;
    salesPrice: number;
    purchasePrice: number;
    stockValue: number;
    gstRate: number;
    logIDs: Set<string>;
    companyID: number;
    stockLogs: StockLog[] | undefined;

    constructor(stock: IStocks) {
        this.id = stock.id || `stk_${nanoid(8)}`
        this.name = stock.name;
        this.quantity = stock.quantity;
        this.salesPrice = stock.salesPrice;
        this.purchasePrice = stock.purchasePrice;
        this.stockValue = stock.stockValue;
        this.gstRate = stock.gstRate;
        this.logIDs = stock.logIDs;
        this.companyID = stock.companyID;
        this.loadStockLogs();

        Object.defineProperty(this, 'stockLogs', {
            enumerable: false,
        });
    }

    async loadStockLogs() {
        const companyDB = db.getCompanyDB(this.companyID)
        const logs = await companyDB.stocklogs.where('stockID').equals(this.id).toArray();
        this.stockLogs = logs
    }

    private onCreate(id: number, stock: Stock, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: stock.companyID,
            clientID: `${stock.name}_${stock.id}`,
            date: new Date(),
            message: `${stock.name} has been added`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/stock/${stock.id}`,
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
            status: "NEW",
            link: `/stock/${stock.id}`,
            isVisible: true
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.stocks.hook.creating.subscribe(this.onCreate);
        return companyDB.transaction('rw', companyDB.stocks, companyDB.stocklogs, companyDB.notificationlogs, (tx) => {
            try {
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