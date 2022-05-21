export interface IExpense {
    id?: number;
    companyID: number;
    date: Date;
    description: string;
    expenseType: ExpenseType;
}

type ExpenseType = "HOUSE_HOLD" | "VEHICLE" | "ELECTRICITY" | "WATER" | "FOOD" | "INTERNET" | "MOBILE" | "TAXES" | "SERVICES" | "OTHER";