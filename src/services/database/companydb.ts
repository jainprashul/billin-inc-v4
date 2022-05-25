import Dexie from "dexie";
import { Client, Expense, IClient, IConfig, Invoices, IProduct, IStockLogs, IStocks, Ledger, NotificationLog, Purchase } from './model';


export class CompanyDB extends Dexie {
    clients! : Dexie.Table<Client, string>;
    expenses! : Dexie.Table<Expense, string>;
    stocks! : Dexie.Table<IStocks, number>;
    stocklogs! : Dexie.Table<IStockLogs, number>;
    ledger! : Dexie.Table<Ledger, number>;
    purchases! : Dexie.Table<Purchase, string>;
    invoices! : Dexie.Table<Invoices, string>;
    products! : Dexie.Table<IProduct, number>;
    settings! : Dexie.Table<IConfig, number>;
    notificationlogs! : Dexie.Table<NotificationLog, number>;

    constructor(dbID: string) {
        super(`${dbID}`);
        // Declare tables
        this.version(1).stores({
            expenses: 'id, companyID, amount, date, categoryID',
            stocks: '++id, companyID, name, quantity, price, date',
            ledger: '++id, companyID, assetID, clientID, amount, date, categoryID',
            purchases: 'id, companyID, voucherNo, clientID, date, categoryID',
            invoices: 'id, companyID, voucherNo, clientID, date, categoryID',
            clients: 'id, companyID, name, gst , address.city, address.state',
            settings: '++id, companyID, name, value',
            notificationlogs: '++id, companyID, clientID, date',
        });
        this.invoices.mapToClass(Invoices);
        this.purchases.mapToClass(Purchase);
        this.clients.mapToClass(Client);
        this.expenses.mapToClass(Expense);
        this.ledger.mapToClass(Ledger);
        this.notificationlogs.mapToClass(NotificationLog);
    
    }

    getClient(clientID : string) : Promise<IClient> {
        return this.clients.get(clientID) as Promise<IClient>;
    }
}


export default CompanyDB;