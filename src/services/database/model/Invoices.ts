import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";


export interface IInvoice {
    id?: string;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: string;
    productIDs: number[];
    billingDate: Date;
    categoryID?: number;
    gstEnabled: boolean;
    gstTotal: number;
    subTotal: number;
    // grossTotal: number;
    discount: boolean
    discountValue?: number;
    // totalAmount: number;
}

export class Invoice implements IInvoice {
    id: string;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: string;
    productIDs: number[];
    billingDate: Date;
    categoryID?: number;
    gstEnabled: boolean;
    gstTotal: number;
    subTotal: number;
    grossTotal: number;
    discount: boolean
    discountValue?: number;
    totalAmount: number;

    constructor(invoice: IInvoice) {
        this.id = invoice.id || `inv_${nanoid(8)}`;
        this.companyID = invoice.companyID;
        this.voucherNo = invoice.voucherNo;
        this.voucherType = invoice.voucherType;
        this.clientID = invoice.clientID;
        this.productIDs = invoice.productIDs;
        this.billingDate = invoice.billingDate;
        this.categoryID = invoice.categoryID;
        this.gstEnabled = invoice.gstEnabled;
        this.gstTotal = invoice.gstTotal;
        this.subTotal = invoice.subTotal;
        this.grossTotal = invoice.gstTotal + invoice.subTotal;
        this.discount = invoice.discount;
        this.discountValue = invoice.discountValue || 0;
        this.totalAmount = this.grossTotal - this.discountValue;
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
            link: `/invoice/${invoice.id}`,
            isVisible: true
        })
        notify.save();
        // companyDB.invoices.hook.creating.unsubscribe(this.onCreate);
    }

    private onDelete(id: string, invoice: Invoice, tx: Transaction) {
        // console.log('Invoice deleted', id, invoice);
        const notify = new NotificationLog({
            companyID: invoice.companyID,
            clientID: invoice.clientID,
            date: new Date(),
            message: `Invoice ${invoice.voucherNo} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/invoice/${invoice.id}`,
            isVisible: true
        })
        notify.save();
        // companyDB.invoices.hook.creating.unsubscribe(this.onCreate);
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.invoices.hook('creating', this.onCreate);

        return companyDB.transaction('rw', companyDB.invoices, companyDB.notificationlogs, (tx) => {
            try {
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
            })
        })
    }
}
// Ref : Invoices.companyID - Company.id
// Ref : Invoices.clientID - Client.id
// Ref : Invoices.productID > Product.id

type InvoiceVoucherType = "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";
