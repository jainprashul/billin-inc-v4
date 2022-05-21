export interface IStocks {
    id?: number;
    name : string;
    quantity : number;
    salesPrice : number;
    purchasePrice : number;
    stockValue : number;
    gstRate : number;
    logIDs : number[];
    companyID : number;
}

// Ref : Stocks.logID > StockLogs.id
// Ref : Stocks.name - Product.name
// Ref : StockLogs.clientID - Client.id