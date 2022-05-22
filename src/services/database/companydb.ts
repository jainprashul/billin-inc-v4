import Dexie from "dexie";
import { IClient, IConfig, IExpense, IInvoice, ILedger, Invoices, IProduct, IPurchase, IStockLogs, IStocks, Purchase } from './model';


export class CompanyDB extends Dexie {
    clients! : Dexie.Table<IClient, number>;
    expenses! : Dexie.Table<IExpense, number>;
    stocks! : Dexie.Table<IStocks, number>;
    stocklogs! : Dexie.Table<IStockLogs, number>;
    ledger! : Dexie.Table<ILedger, number>;
    purchases! : Dexie.Table<Purchase, number>;
    invoices! : Dexie.Table<Invoices, number>;
    products! : Dexie.Table<IProduct, number>;
    settings! : Dexie.Table<IConfig, number>;

    constructor(dbID: string) {
        super(`${dbID}`);
        // Declare tables
        this.version(1).stores({
            expenses: '++id, companyID, name, amount, date, categoryID',
            stocks: '++id, companyID, name, quantity, price, date',
            ledger: '++id, companyID, assetID, clientID, amount, date, categoryID',
            purchases: '++id, companyID, voucherNo, clientID, date, categoryID',
            invoices: '++id, companyID, voucherNo, clientID, date, categoryID',
            // reports : '++id, companyID, name, amount, date, category',
            settings: '++id, companyID, name, value',
            notificationlogs: '++id, companyID, clientID, date',
        });
        this.invoices.mapToClass(Invoices);
        this.purchases.mapToClass(Purchase);
    }

    getClient(clientID : number) : Promise<IClient> {
        return this.clients.get(clientID) as Promise<IClient>;
    }
}


export default CompanyDB;