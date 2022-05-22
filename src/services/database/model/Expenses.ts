import db from "../db";

export interface IExpense {
    id?: number;
    companyID: number;
    date: Date;
    description: string;
    expenseType: ExpenseType;
    amount: number;
}

type ExpenseType = "HOUSE_HOLD" | "VEHICLE" | "ELECTRICITY" | "WATER" | "FOOD" | "INTERNET" | "MOBILE" | "TAXES" | "SERVICES" | "OTHER";

export class Expense implements IExpense {
    id?: number;
    companyID: number;
    date: Date;
    description: string;
    expenseType: ExpenseType;
    amount: number;

    constructor(expense: IExpense) {
        if (expense.id) this.id = expense.id;
        this.companyID = expense.companyID;
        this.date = expense.date;
        this.description = expense.description;
        this.expenseType = expense.expenseType;
        this.amount = expense.amount;
    }

    save() {
        const companyDB = db.getCompanyDB(this.companyID)
        // console.log(companyDB);
        const _save = companyDB.expenses.put({...this}).then(_id => {
            this.id = _id;
            return this.id;
        });
        return _save;
    }

    delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        return companyDB.expenses.delete(this.id as number);
    }
}