export interface IStockLogs {
    id?: number;
    stockID : number;
    voucherNo : string;
    logType : StockLogType;
    quantity : number;
    rate : number;
    date : Date;
    amount : number;
    companyID : number;
    clientID : number;
}

type StockLogType = "SALE" | "PURCHASE" | "TRANSFER" | "OPENING_STOCK" | "CLOSING_STOCK" | "ADJUSTMENT";
    