import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import authService from "../../authentication/auth.service";
import db from "../db";
import { NotificationLog } from "./NotificationLog";

export interface IProduct {
    id?: string;
    name: string;
    categoryID?: number;
    gstRate: GstRate;
    hsn: string;
    price: number;
    quantity: number;
    unit: ProductUnit;
    companyID: number;
    voucherID: string;
    createdAt?: Date;
}

type ProductUnit = "KG" | "L" | "PCS" | "BOX" | "BAG" | "BOTTLE" | "CARTON";

export type GstRate = 0 | 5 | 12 | 18 | 28;

export class Product implements IProduct {
    id: string;
    name: string;
    categoryID?: number;
    gstRate: GstRate;
    hsn: string;
    price: number;
    quantity: number;
    unit: ProductUnit;
    companyID: number;
    gstAmount: number;
    totalAmount: number;
    grossAmount: number;
    voucherID: string;
    createdAt: Date;
    updatedAt: Date;

    constructor(product: IProduct) {
        let isInclusive = Boolean(JSON.parse(localStorage.getItem("gstRateInclusive") || "false"));
        this.id = product.id || `prod_${nanoid(8)}`;
        this.voucherID = product.voucherID;
        this.name = product.name;
        this.categoryID = product.categoryID;
        this.gstRate = product.gstRate;
        this.hsn = product.hsn;
        this.price = isInclusive ? parseFloat((product.price * 100 / (100 + product.gstRate)).toFixed(2)) : product.price;
        this.quantity = product.quantity;
        this.unit = product.unit;
        this.companyID = product.companyID;
        this.grossAmount = this.price * product.quantity;
        this.gstAmount = parseFloat((this.grossAmount * (this.gstRate / 100)).toFixed(2));
        this.totalAmount = this.grossAmount + this.gstAmount;
        this.createdAt = product.createdAt || new Date();
        this.updatedAt = new Date();
    }

    private addtoVoucher() {
        const companyDB = db.getCompanyDB(this.companyID)
        if (this.voucherID.startsWith("inv_")) {
            companyDB.invoices.get(this.voucherID).then(invoice => {
                if (invoice) {
                    invoice.productIDs.add(this.id);
                    companyDB.invoices.update(invoice.id, invoice);

                }
            });
        } else if (this.voucherID.startsWith("pur_")) {
            companyDB.purchases.get(this.voucherID).then(purchase => {
                if (purchase) {
                    purchase.productIDs.add(this.id);
                    companyDB.purchases.update(purchase.id, purchase);
                }
            });
        }
    }

    private removeFromVoucher() {
        const companyDB = db.getCompanyDB(this.companyID)
        if (this.voucherID.startsWith("inv_")) {
            companyDB.invoices.get(this.voucherID).then(invoice => {
                if (invoice) {
                    invoice.productIDs.delete(this.id);
                    companyDB.invoices.update(invoice.id, invoice);
                }
            });
        } else if (this.voucherID.startsWith("pur_")) {
            companyDB.purchases.get(this.voucherID).then(purchase => {
                if (purchase) {
                    purchase.productIDs.delete(this.id);
                    companyDB.purchases.update(purchase.id, purchase);
                }
            });
        }
    }

    private onCreate(id: number, product: Product, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: product.companyID,
            clientID: `${product.name}_${product.id}`,
            date: new Date(),
            message: `Product ${product.id} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW", createdBy: authService.getUser()?.name || 'System',
            type: "PRODUCT",
            link: `/stock/${product.id}`,
        });
        notify.save();
    }

    private onDelete(id: number, product: Product, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: product.companyID,
            clientID: `${product.name}_${product.id}`,
            date: new Date(),
            message: `Product ${product.id} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW", createdBy: authService.getUser()?.name || 'System',
            type: "PRODUCT",
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.products.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction("rw", companyDB.products, companyDB.invoices, companyDB.purchases, companyDB.notificationlogs, (tx) => {
            try {
                this.updatedAt = new Date();
                const _save = companyDB.products.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log("Product saved", _id);
                    this.addtoVoucher();
                    return this.id;
                });
                return _save;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort()
            }
        });
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.products.hook.deleting.subscribe(this.onDelete);

        return companyDB.transaction("rw", companyDB.products, companyDB.invoices, companyDB.purchases, companyDB.notificationlogs, (tx) => {
            try {
                const _delete = companyDB.products.delete(this.id).then(_id => {
                    console.log("Product deleted", this.id);
                    this.removeFromVoucher();
                    return this.id;
                });
                return _delete;
            } catch (error) {
                console.log('CompanyDB does not exists. \n', error);
                tx.abort();
            }
        });
    }
}