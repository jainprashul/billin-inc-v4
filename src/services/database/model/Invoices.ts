export interface IInvoice {
    id?: number;
    companyID: number;
    voucherNo: string;
    voucherType: InvoiceVoucherType;
    clientID: number;
    productIDs: number[];
    billingDate: Date;
    categoryID: number;
    gstEnabled: boolean;
    gstTotal: number;
    subTotal: number;
    grossTotal: number;
    discount: boolean
    discountValue?: number;
    totalAmount: number;
}

// Ref : Invoices.companyID - Company.id
// Ref : Invoices.clientID - Client.id
// Ref : Invoices.productID > Product.id


type InvoiceVoucherType =  "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";
