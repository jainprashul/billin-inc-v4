import { IClient, Client } from "./Client"
import { ICompany, IAddress, ICategory, IContact, Company } from "./Company"
import { IStocks } from "./Stocks"
import { IStockLogs } from "./StockLogs"
import { ILedger, Ledger } from "./Ledger"
import { IInvoice, Invoice } from "./Invoices"
import { IUser, IRole, User } from "./User"
import { IPurchase, Purchase } from "./Purchase"
import { INotificationLog, NotificationLog } from "./NotificationLog"
import { IExpense, Expense } from "./Expenses"
import { IConfig } from "./Config"
import { IProduct } from "./Product"

export type {
    IClient,
    ICompany,
    IStocks,
    IStockLogs,
    ILedger,
    IInvoice,
    IUser,
    IRole,
    IAddress,
    ICategory,
    IContact,
    IPurchase,
    INotificationLog,
    IExpense,
    IConfig,
    IProduct,
}

export {
   Company, User, Purchase, Invoice as Invoices, Client, Expense, Ledger, NotificationLog
}