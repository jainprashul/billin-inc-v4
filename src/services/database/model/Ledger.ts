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

// Ref : Ledger.voucherID - Purchase.id
// Ref : Ledger.voucherID - Invoices.id
// Ref : Ledger.clientID - Client.id
// Ref : Ledger.companyID - Company.id