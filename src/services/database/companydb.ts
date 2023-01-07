import Dexie from "dexie";
import { Client, Expense, IConfig, Invoices, Ledger, NotificationLog, Product, Purchase, Stock, StockLog } from './model';
import { BankAccount } from "./model/BankAccount";
import { Report } from "./model/Report";


export class CompanyDB extends Dexie {
    clients!: Dexie.Table<Client, string>;
    expenses!: Dexie.Table<Expense, string>;
    stocks!: Dexie.Table<Stock, string>;
    stocklogs!: Dexie.Table<StockLog, string>;
    ledger!: Dexie.Table<Ledger, number>;
    purchases!: Dexie.Table<Purchase, string>;
    invoices!: Dexie.Table<Invoices, string>;
    products!: Dexie.Table<Product, string>;
    settings!: Dexie.Table<IConfig, number>;
    notificationlogs!: Dexie.Table<NotificationLog, number>;
    reports!: Dexie.Table<Report , number>;
    bankAccounts!: Dexie.Table<BankAccount, string>;

    constructor(dbID: string) {
        super(`${dbID}`);
        // Declare tables
        this.version(1.3).stores({
            expenses: 'id, companyID, amount, date, categoryID',
            stocks: '++id, companyID, &name, quantity',
            ledger: '++id, companyID, assetID, clientID, amount, date, categoryID',
            purchases: 'id, companyID, voucherNo, clientID, billingDate, categoryID',
            invoices: 'id, companyID, voucherNo, clientID, billingDate, categoryID',
            clients: 'id, companyID, &name, gst , address.city, address.state',
            settings: '++id, companyID, name, value',
            notificationlogs: '++id, companyID, clientID, date, isVisible, type, action, createdBy',
            products: 'id, companyID, name, hsn, unit, voucherID, categoryID',
            stocklogs: '++id, stockID, voucherNo, logType, companyID, clientID, date',
            reports : '++id, companyID, type, from, to, [from+to+type]',
            bankAccounts : '++id, companyID, name, accountNumber'
        });
        this.invoices.mapToClass(Invoices);
        this.purchases.mapToClass(Purchase);
        this.clients.mapToClass(Client);
        this.expenses.mapToClass(Expense);
        this.ledger.mapToClass(Ledger);
        this.notificationlogs.mapToClass(NotificationLog);
        this.products.mapToClass(Product);
        this.stocklogs.mapToClass(StockLog);
        this.stocks.mapToClass(Stock);
        this.reports.mapToClass(Report);
        this.bankAccounts.mapToClass(BankAccount);

    }

    getClient(clientID: string): Promise<Client> {
        return this.clients.get(clientID) as Promise<Client>;
    }
}


export default CompanyDB;