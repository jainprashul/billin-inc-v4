import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";

export interface ILedger {
    id?: number;
    voucherNo?: string;
    voucherType?: LedgerVoucherType;
    cash: number;
    credit: number;
    debit: number;
    payable: number;
    receivable: number;
    payableType: PayableType;
    receivableType: PayableType;
    companyID: number;
    clientID: string;
    date: Date;
    clientType: ClientType;
}

type ClientType = "CUSTOMER" | "VENDOR" | "EMPLOYEE" | "SUPPLIER";
type LedgerVoucherType = "SALES" | "PURCHASE" | "PAYMENT" | "RECEIPT" | "JOURNAL" | "TRANSFER";
type PayableType = "CASH" | "UPI" | "NEFT" | "CARD" | "CHEQUE" | "CREDIT" | "DEBIT" | "OTHER";

export class Ledger implements ILedger {
    id?: number;
    voucherNo?: string;
    voucherType?: LedgerVoucherType;
    cash: number;
    credit: number;
    debit: number;
    payable: number;
    receivable: number;
    payableType: PayableType;
    receivableType: PayableType;
    companyID: number;
    clientID: string;
    date: Date;
    clientType: ClientType;

    constructor(ledger: ILedger) {
        if (ledger.id) this.id = ledger.id;
        this.voucherNo = ledger.voucherNo;
        this.voucherType = ledger.voucherType;
        this.cash = ledger.cash;
        this.credit = ledger.credit;
        this.debit = ledger.debit;
        this.payable = ledger.payable;
        this.receivable = ledger.receivable;
        this.payableType = ledger.payableType;
        this.receivableType = ledger.receivableType;
        this.companyID = ledger.companyID;
        this.clientID = ledger.clientID;
        this.date = ledger.date;
        this.clientType = ledger.clientType;
    }

    private onCreate(id: string, ledgerItem: Ledger, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: ledgerItem.companyID,
            clientID: ledgerItem.clientID,
            date: new Date(),
            message: `Ledger Entry for ${ledgerItem.voucherNo} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/expense/${ledgerItem.id}`
        });
        notify.save();
    }

    private onDelete(id: string, ledgerItem: Ledger, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: ledgerItem.companyID,
            clientID: ledgerItem.clientID,
            date: new Date(),
            message: `Ledger Entry for ${ledgerItem.voucherNo} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/expense/${ledgerItem.id}`
        });
        notify.save();
    }


    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.ledger.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction("rw", companyDB.ledger, companyDB.notificationlogs, async (tx) => {
            try {
                // console.log(companyDB);
                const _save = companyDB.ledger.put({ ...this }).then(_id => {
                    this.id = _id;
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
        companyDB.ledger.hook.deleting.subscribe(this.onDelete);
        return companyDB.transaction("rw", companyDB.ledger, companyDB.notificationlogs, async (tx) => {
            return companyDB.ledger.delete(this.id as number).then(_id => {
                console.log("Ledger deleted", this.id);
                return this.id;
            });
        });
    }
}
// Ref : Ledger.voucherID - Purchase.id
// Ref : Ledger.voucherID - Invoices.id
// Ref : Ledger.clientID - Client.id
// Ref : Ledger.companyID - Company.id