export interface IPurchase {
    id?: number;
    companyID: string;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
    clientID: number;
    productID: number[];
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

// Ref : Purchase.companyID - Company.id
// Ref : Purchase.clientID - Client.id
// Ref : Purchase.productID > Product.id


type PurchaseVoucherType =  "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";