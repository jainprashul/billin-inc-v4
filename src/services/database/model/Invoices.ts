import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import authService from "../../authentication/auth.service";
import db from "../db";
import { Client } from "./Client";
import { NotificationLog, NotificationType } from "./NotificationLog";
import { Product } from "./Product";


export interface IInvoice {
    id?: string;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: string;
    client?: Client;
    products?: Product[];
    productIDs: Set<string>;
    billingDate: Date;
    categoryID?: number;
    gstEnabled: boolean;
    gstTotal: number;
    subTotal: number;
    // grossTotal: number;
    discount: boolean
    discountValue?: number;
    // totalAmount: number;
    amountPaid?: number;
    createdAt?: Date;
}

export class Invoice implements IInvoice {
    id: string;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: string;
    client: Client | undefined;
    productIDs: Set<string>;
    products: Product[];
    billingDate: Date;
    categoryID?: number;
    gstEnabled: boolean;
    gstTotal: number;
    subTotal: number;
    grossTotal: number;
    discount: boolean
    discountValue?: number;
    totalAmount: number;
    amountPaid: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(invoice: IInvoice) {
        this.id = invoice.id || `inv_${nanoid(8)}`;
        this.companyID = invoice.companyID;
        this.voucherNo = invoice.voucherNo;
        this.voucherType = invoice.voucherType;
        this.clientID = invoice.clientID;
        this.productIDs = invoice.productIDs;
        this.products = invoice.products ? invoice.products.map(p => new Product(p)) : [];
        this.client = invoice.client ? new Client({ ...invoice.client }) : undefined;
        this.billingDate = invoice.billingDate;
        this.categoryID = invoice.categoryID;
        this.gstEnabled = invoice.gstEnabled;
        this.gstTotal = invoice.gstTotal;
        this.subTotal = invoice.subTotal;
        this.grossTotal = invoice.gstTotal + invoice.subTotal;
        this.discount = invoice.discount;
        this.discountValue = invoice.discountValue || 0;
        this.totalAmount = this.grossTotal - this.discountValue;
        this.amountPaid = invoice.amountPaid || 0;
        this.createdAt = invoice.createdAt || new Date();
        this.updatedAt = new Date();
        // this.loadProducts();
        Object.defineProperty(this, 'products', {
            enumerable: false,
        })
    }

    loadProducts() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.transaction('rw', companyDB.products, async (tx) => {
            const products = await companyDB.products.where('voucherID').equals(this.id).toArray();
            // console.log('Invoice products', products);
            this.products = products;
        })
    }

    async loadClient() {
        const companyDB = db.getCompanyDB(this.companyID)
        const client = await companyDB.clients.get(this.clientID)
        this.client = client;
    }

    private onCreate(id: string, invoice: Invoice, tx: Transaction) {
        // console.log('Invoice created', id, invoice);
        const notify = new NotificationLog({
            companyID: invoice.companyID,
            clientID: invoice.clientID,
            date: new Date(),
            message: `Invoice ${invoice.voucherNo} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW", 
            createdBy: authService.getUser()?.name || 'System',
            type: NotificationType.INVOICE,
            link: `/invoice/${invoice.voucherNo}`,
            isVisible: true
        })
        notify.save();
    }

    private onDelete(id: string, invoice: Invoice, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: invoice.companyID,
            clientID: invoice.clientID,
            date: new Date(),
            message: `Invoice ${invoice.voucherNo} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            createdBy: authService.getUser()?.name || 'System',
            type: NotificationType.INVOICE,
            link: `/invoice`,
            isVisible: true
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.invoices.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction('rw', companyDB.invoices, companyDB.notificationlogs, (tx) => {
            try {
                this.updatedAt = new Date();
                const _save = companyDB.invoices.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log('Invoice saved', _id);
                    return this.id;
                });
                return _save;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        })
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.invoices.hook('deleting', this.onDelete);

        return companyDB.transaction('rw', companyDB.invoices, companyDB.notificationlogs, (tx) => {
            return companyDB.invoices.delete(this.id as string).then(() => {
                console.log('Invoice deleted', this.id);
                return this.id;
            });
        })
    }
}
// Ref : Invoices.companyID - Company.id
// Ref : Invoices.clientID - Client.id
// Ref : Invoices.productID > Product.id

type InvoiceVoucherType = "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";
