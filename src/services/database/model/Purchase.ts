import db from "../db";

export interface IPurchase {
    id?: number;
    companyID: number;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
    clientID: number;
    productIDs: number[];
    billingDate: Date;
    categoryID: number;
    gstEnabled: boolean;
    gstTotal: number;
    subTotal: number;
    // grossTotal: number;
    discount: boolean
    discountValue?: number;
    // totalAmount: number;
}

export class Purchase implements IPurchase {
    id?: number;
    companyID: number;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
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

    constructor(purchase: IPurchase) {
        if (purchase.id) this.id = purchase.id;
        this.companyID = purchase.companyID;
        this.voucherNo = purchase.voucherNo;
        this.voucherType = purchase.voucherType;
        this.clientID = purchase.clientID;
        this.productIDs = purchase.productIDs;
        this.billingDate = purchase.billingDate;
        this.categoryID = purchase.categoryID;
        this.gstEnabled = purchase.gstEnabled;
        this.gstTotal = purchase.gstTotal;
        this.subTotal = purchase.subTotal;
        this.grossTotal = purchase.gstTotal + purchase.subTotal;
        this.discount = purchase.discount;
        this.discountValue = purchase.discountValue || 0;
        this.totalAmount = this.grossTotal - this.discountValue;
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        // console.log(companyDB);
        try {
            const _save = companyDB.purchases.put({...this}).then(_id => {
                this.id = _id;
                console.log(this.id);
                return this.id;
            });
            return _save;
        } catch (error) {
            console.log('CompanyDB does not exists. \n', error);
        }
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.purchases.delete(this.id as number);
    }
}
// Ref : Purchase.companyID - Company.id
// Ref : Purchase.clientID - Client.id
// Ref : Purchase.productID > Product.id

type PurchaseVoucherType =  "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";