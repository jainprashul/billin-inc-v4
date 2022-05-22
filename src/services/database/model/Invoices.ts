import db from "../db";


export interface IInvoice {
    id?: number;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: number;
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
}

export class Invoices implements IInvoice {
    id?: number;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: number;
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
        if (invoice.id) this.id = invoice.id;
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
        this.grossTotal = invoice.grossTotal;
        this.discount = invoice.discount;
        this.discountValue = invoice.discountValue;
        this.totalAmount = invoice.totalAmount;
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)

        return companyDB.transaction('rw', companyDB.invoices, companyDB.clients, companyDB.products, async () => {
            const _save = companyDB.invoices.put(this).then(_id => {
                this.id = _id;
                console.log(this.id);
                return this.id;
            });
            return _save;
        });

    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.transaction('rw', companyDB.invoices, companyDB.clients, companyDB.products, async () => {
            const _delete = companyDB.invoices.delete(this.id as number);
            return _delete;
        });
    }

}

// Ref : Invoices.companyID - Company.id
// Ref : Invoices.clientID - Client.id
// Ref : Invoices.productID > Product.id


type InvoiceVoucherType = "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";
