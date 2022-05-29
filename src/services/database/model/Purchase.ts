import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";
import { Product } from "./Product";

export interface IPurchase {
    id?: string;
    companyID: number;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
    clientID: string;
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
}

export class Purchase implements IPurchase {
    id: string;
    companyID: number;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
    clientID: string;
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

    constructor(purchase: IPurchase) {
        this.id = purchase.id || `pur_${nanoid(8)}`;
        this.companyID = purchase.companyID;
        this.voucherNo = purchase.voucherNo;
        this.voucherType = purchase.voucherType;
        this.clientID = purchase.clientID;
        this.productIDs = purchase.productIDs;
        this.products = [];
        this.billingDate = purchase.billingDate;
        this.categoryID = purchase.categoryID;
        this.gstEnabled = purchase.gstEnabled;
        this.gstTotal = purchase.gstTotal;
        this.subTotal = purchase.subTotal;
        this.grossTotal = purchase.gstTotal + purchase.subTotal;
        this.discount = purchase.discount;
        this.discountValue = purchase.discountValue || 0;
        this.totalAmount = this.grossTotal - this.discountValue;
        // this.loadProducts();
        Object.defineProperty(this, 'products', {
            enumerable: false,
        })
    }

    loadProducts() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.transaction('rw', companyDB.products, async (tx) => {
            const products = await companyDB.products.where('voucherID').equals(this.id).toArray();
            // console.log('Purchase products', products);

            this.products = products;
        })
    }

    private onCreate(id: string, purchase: Purchase, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: purchase.companyID,
            clientID: purchase.clientID,
            date: new Date(),
            message: `Purchase ${purchase.voucherNo} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/purchase/${purchase.id}`,
            isVisible: true
        });
        notify.save();
    }

    private onDelete(id: string, purchase: Purchase, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: purchase.companyID,
            clientID: purchase.clientID,
            date: new Date(),
            message: `Purchase ${purchase.voucherNo} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/purchase/${purchase.id}`,
            isVisible: true
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.purchases.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction('rw', companyDB.purchases, companyDB.notificationlogs, (tx) => {
            try {
                const _save = companyDB.purchases.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log("Purchase saved", _id);
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
        companyDB.purchases.hook("deleting", this.onDelete);

        return companyDB.transaction('rw', companyDB.purchases, companyDB.notificationlogs, (tx) => {
            return companyDB.purchases.delete(this.id as string).then(() => {
                console.log("Purchase deleted", this.id);
                return this.id;
            });
        })
    }
}
// Ref : Purchase.companyID - Company.id
// Ref : Purchase.clientID - Client.id
// Ref : Purchase.productID > Product.id

type PurchaseVoucherType = "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";