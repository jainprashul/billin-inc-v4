import { IClient, Client } from "./Client"
import { ICompany, IAddress, ICategory, IContact, Company } from "./Company"
import { IStocks, Stock } from "./Stocks"
import { IStockLogs, StockLog } from "./StockLogs"
import { ILedger, Ledger } from "./Ledger"
import { IInvoice, Invoice } from "./Invoices"
import { IUser, IRole, User, AdminRole, UserRole, Usr } from "./User"
import { IPurchase, Purchase } from "./Purchase"
import { INotificationLog, NotificationLog } from "./NotificationLog"
import { IExpense, Expense } from "./Expenses"
import { IConfig, Config, defaultConfig } from "./Config"
import { IProduct, Product } from "./Product"
import { IBackup, Backup } from "./Backup"

const UserRoles = [AdminRole, UserRole]

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
    IBackup,
    Usr
}

export {
    Company, User, Purchase, Invoice as Invoices, Client, Expense, Ledger, NotificationLog, Product, StockLog, Stock, Backup, UserRoles, Config, defaultConfig
}