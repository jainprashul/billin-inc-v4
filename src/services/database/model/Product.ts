import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";

export interface IProduct {
    id?: string;
    name : string;
    categoryID? : number;
    gstRate : GstRate;
    hsn : string;
    price : number;
    quantity : number;
    unit : ProductUnit;
    companyID : number;
}

type ProductUnit = "KG" | "L" | "PCS" | "BOX" | "BAG" | "BOTTLE" | "CARTON";

type GstRate = 0 | 5 | 12 | 18 | 28;

export class Product implements IProduct {
    id: string;
    name : string;
    categoryID? : number;
    gstRate : GstRate;
    hsn : string;
    price : number;
    quantity : number;
    unit : ProductUnit;
    companyID : number;
    gstAmount : number;
    totalAmont : number; 
    grossAmount: number;

    constructor(product: IProduct) {
        this.id = product.id || `prod_${nanoid(8)}`
        this.name = product.name;
        this.categoryID = product.categoryID;
        this.gstRate = product.gstRate;
        this.hsn = product.hsn;
        this.price = product.price;
        this.quantity = product.quantity;
        this.unit = product.unit;
        this.companyID = product.companyID;
        this.grossAmount = product.price * product.quantity;
        this.gstAmount = this.grossAmount * (product.gstRate / 100);
        this.totalAmont = this.grossAmount + this.gstAmount;
    }

    private onCreate(id: number, product: Product, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: product.companyID,
            clientID: `${product.name}_${product.id}`,
            date: new Date(),
            message: `Product ${product.id} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/stock/${product.id}`
        });
        notify.save();
    }

    private onDelete(id: number, product: Product, tx: Transaction) {
        // console.log(id);
        const notify = new NotificationLog({
            companyID: product.companyID,
            clientID: `${product.name}_${product.id}`,
            date: new Date(),
            message: `Product ${product.id} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",

        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.products.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction("rw", companyDB.products, companyDB.notificationlogs, (tx) => {
            try {
                const _save = companyDB.products.put({...this}).then(_id => {
                    this.id = _id;
                    console.log("Product saved", _id);
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

        return companyDB.transaction("rw", companyDB.products, companyDB.notificationlogs, (tx) => {
            try {
                const _delete = companyDB.products.delete(this.id).then(_id => {
                    console.log("Product deleted", this.id);
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