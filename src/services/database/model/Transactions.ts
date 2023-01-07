export interface ITransaction {
    id?: number | string;
    bankAccountID: number | string;
    date: Date;
    amount: number;
    /** @example deposit | withdrawal | transfer */
    type: string;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
}