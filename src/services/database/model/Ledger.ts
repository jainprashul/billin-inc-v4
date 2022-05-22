import db from "../db";

export interface ILedger {
    id?: number;
    voucherNo?: string;
    voucherType?: LedgerVoucherType;
    cash : number;
    credit : number;
    debit : number;
    payable : number;
    receivable : number;
    payableType : PayableType;
    receivableType : PayableType;
    companyID : number;
    clientID : number;
    date : Date;
    clientType : ClientType;
}

type ClientType = "CUSTOMER" | "VENDOR" | "EMPLOYEE" | "SUPPLIER";
type LedgerVoucherType =  "SALES" | "PURCHASE" | "PAYMENT" | "RECEIPT" | "JOURNAL" | "TRANSFER";
type PayableType =  "CASH" | "UPI" | "NEFT" | "CARD" | "CHEQUE" | "CREDIT" | "DEBIT" | "OTHER";

export class Ledger implements ILedger {
    id?: number;
    voucherNo?: string;
    voucherType?: LedgerVoucherType;
    cash : number;
    credit : number;
    debit : number;
    payable : number;
    receivable : number;
    payableType : PayableType;
    receivableType : PayableType;
    companyID : number;
    clientID : number;
    date : Date;
    clientType : ClientType;

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

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        // console.log(companyDB);
        const _save = companyDB.ledger.put({...this}).then(_id => {
            this.id = _id;
            return this.id;
        });
        return _save;
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.ledger.delete(this.id as number);
    }
}

// Ref : Ledger.voucherID - Purchase.id
// Ref : Ledger.voucherID - Invoices.id
// Ref : Ledger.clientID - Client.id
// Ref : Ledger.companyID - Company.id