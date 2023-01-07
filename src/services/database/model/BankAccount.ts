import { nanoid } from "@reduxjs/toolkit";
import { Transaction } from "dexie";
import authService from "../../authentication/auth.service";
import db from "../db";
import { NotificationLog, NotificationType } from "./NotificationLog";
import { ITransaction } from "./Transactions";

export interface IBankAccount {
    id?: string;
    accountNo: string;
    accountType: string;
    accountHolder: string;
    ifsc: string;
    bankName: string;
    branch: string;
    companyID: number;
    createdAt?: Date;
    updatedAt?: Date;
}



export class BankAccount implements IBankAccount {
    id: string;
    accountNo: string;
    accountType: string;
    accountHolder: string;
    ifsc: string;
    bankName: string;
    branch: string;
    private transactions: ITransaction[];
    companyID: number;
    createdAt?: Date;
    updatedAt?: Date;
    constructor(bankAccount: IBankAccount) {
        this.id = bankAccount.id || `bank_${nanoid(8)}`
        this.accountNo = bankAccount.accountNo;
        this.accountType = bankAccount.accountType;
        this.accountHolder = bankAccount.accountHolder;
        this.ifsc = bankAccount.ifsc;
        this.bankName = bankAccount.bankName;
        this.branch = bankAccount.branch;
        this.transactions = [];
        this.companyID = bankAccount.companyID;
        this.createdAt = bankAccount.createdAt || new Date();
        this.updatedAt = new Date();
    }


    private onDelete(id: string, bank: BankAccount, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: bank.companyID,
            clientID: `${bank.companyID}_${bank.id}`,
            date: new Date(),
            message: `Bank ${bank.bankName} deleted`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            type: NotificationType.BANK_ACCOUNT,
            action: "DELETE",
            // link: `/expenses`,
            isVisible: true,
            createdBy: authService.getUser()?.name || 'System',

        });
        notify.save();
    }

    private onUpdate(change: Partial<BankAccount>, id: string, account: BankAccount, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: account.companyID,
            clientID: `${account.companyID}_${account.id}`,
            date: new Date(),
            message: `Bank ${account.bankName} updated`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",
            createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.BANK_ACCOUNT,
            action: 'UPDATE',
            isVisible: true,
        });
        notify.save();
    }

    private onCreate(id: number, account: BankAccount, tx: Transaction) {
        const notify = new NotificationLog({
            companyID: account.companyID,
            clientID: `${account.accountType}_${account.id}`,
            date: new Date(),
            message: `${account.bankName} created`,
            notificationID: `ntf-${nanoid(8)}`,
            status: "NEW",  
            createdBy : authService.getUser()?.name || 'System',
            type: NotificationType.REPORT,
            action: 'CREATE',
            isVisible: false
        });
        notify.save();
    }

    async save() {
        const companyDB = db.getCompanyDB(this.companyID);
        companyDB.bankAccounts.hook.creating.subscribe(this.onCreate);
        companyDB.bankAccounts.hook.updating.subscribe(this.onUpdate);
        companyDB.transaction("rw", companyDB.bankAccounts, async (tx) => {
            try {
                this.updatedAt = new Date();
                const _id = await companyDB.bankAccounts.put({ ...this });
                this.id = _id;
                return this.id;

            } catch (error) {
                tx.abort();
                console.log("Company DB does not exist", error);
            }
        });
    }

    async delete() {
        const companyDB = db.getCompanyDB(this.companyID)
        companyDB.bankAccounts.hook.deleting.subscribe(this.onDelete);
        return companyDB.transaction("rw", companyDB.expenses, companyDB.notificationlogs, () => {
            companyDB.bankAccounts.delete(this.id as string).then(() => {
                console.log('Expense Deleted', this.id);
                return this.id;
            });
        });
    }

    getTransactions() {
        return this.transactions;
    }

    async addTransaction(transaction: ITransaction) {
        const companyDB = db.getCompanyDB(this.companyID);
        companyDB.transaction("rw", companyDB.bankAccounts, async (tx) => {
            try {
                transaction.id = `txn_${nanoid(12)}`;
                transaction.bankAccountID = this.id as string;
                transaction.createdAt = new Date();
                this.transactions.push(transaction);

                await companyDB.bankAccounts.put({ ...this });
                return transaction.id;
            } catch (error) {
                tx.abort();
                console.log("Company DB does not exist", error);
            }
        });
    }

    toJSON() {
        const val : IBankAccount = { ...this };
        return val;
    }

}