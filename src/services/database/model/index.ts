import { IClient } from "./Client"
import { ICompany, IAddress, ICategory, IContact } from "./Company"
import { IStocks } from "./Stocks"
import { IStockLogs } from "./StockLogs"
import { ILedger } from "./Ledger"
import { IInvoice } from "./Invoices"
import { IUser, IRole } from "./User"
import { IPurchase } from "./Purchase"
import { INotificationLog } from "./NotificationLog"
import { IExpense } from "./Expenses"
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
    IProduct
}