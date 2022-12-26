import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import db from "../db";
import { NotificationLog } from "./NotificationLog";

export interface IExpense {
    id?: string;
    companyID: number;
    date: Date;
    description: string;
    expenseType: ExpenseType;
    amount: number;
    createdAt?: Date;
}

type ExpenseType = "HOUSE_HOLD" | "VEHICLE" | "ELECTRICITY" | "WATER" | "FOOD" | "INTERNET" | "MOBILE" | "TAXES" | "SERVICES" | "OTHER";

export class Expense implements IExpense {
    id?: string;
    companyID: number;
    date: Date;
    description: string;
    expenseType: ExpenseType;
    amount: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(expense: IExpense) {
        this.id = expense.id || `exp_${nanoid(8)}`;
        this.companyID = expense.companyID;
        this.date = expense.date;
        this.description = expense.description;
        this.expenseType = expense.expenseType;
        this.amount = expense.amount;
        this.createdAt = expense.createdAt || new Date();
        this.updatedAt = new Date();
    }

    private onCreate(id: string, expense: Expense, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: expense.companyID,
            clientID: `${expense.expenseType}_${expense.id}`,
            date: new Date(),
            message: `Expense ${expense.description} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/expense/${expense.id}`,
            isVisible: true
        });
        notify.save();
    }

    private onDelete(id: string, expense: Expense, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: expense.companyID,
            clientID: `${expense.expenseType}_${expense.id}`,
            date: new Date(),
            message: `Expense ${expense.description} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            link: `/expense/${expense.id}`,
            isVisible: true
        });
        notify.save();
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.expenses.hook.creating.subscribe(this.onCreate);

        return companyDB.transaction("rw", companyDB.expenses, companyDB.notificationlogs, (tx) => {
            try {
                this.updatedAt = new Date();
                const _save = companyDB.expenses.put({ ...this }).then(_id => {
                    this.id = _id;
                    console.log("Expense saved", _id);
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
        companyDB.expenses.hook("deleting", this.onDelete);
        return companyDB.transaction("rw", companyDB.expenses, companyDB.notificationlogs, () => {
            companyDB.expenses.delete(this.id as string).then(() => {
                console.log('Expense Deleted', this.id);
                return this.id;
            });
        });
    }
}