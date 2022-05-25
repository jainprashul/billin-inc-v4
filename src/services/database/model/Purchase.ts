import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";

export interface IPurchase {
    id?: string;
    companyID: number;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
    clientID: string;
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
    id: string;
    companyID: number;
    voucherNo: string;
    voucherType: PurchaseVoucherType;
    clientID: string;
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
        this.id = purchase.id || `pur_${nanoid(8)}`;
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

    private onCreate(id: string, purchase: Purchase, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: purchase.companyID,
            clientID: purchase.clientID,
            date: new Date(),
            message: `Purchase ${purchase.voucherNo} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/purchase/${purchase.id}`
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
            link: `/purchase/${purchase.id}`
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        // console.log(companyDB);
        companyDB.transaction('rw', companyDB.purchases, companyDB.notificationlogs , () => {
            try {
                const _save = companyDB.purchases.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log("Purchase saved", _id);
                    return this.id;
                });
                return _save;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
            }
        })

        // companyDB.purchases.hook("creating", this.onCreate);
        companyDB.purchases.hook.creating.subscribe(this.onCreate);
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.transaction('rw', companyDB.purchases, companyDB.notificationlogs , () => {
        companyDB.purchases.delete(this.id as string).then(_id => {
            console.log("Purchase deleted", _id);
            return _id;
        });
        })
        companyDB.purchases.hook("deleting", this.onDelete);
    }
}
// Ref : Purchase.companyID - Company.id
// Ref : Purchase.clientID - Client.id
// Ref : Purchase.productID > Product.id

type PurchaseVoucherType = "NON_GST" | "INTRA_STATE" | "INTER_STATE" | "EXPORT" | "PURCHASE";