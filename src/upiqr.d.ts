

declare module "upiqr" {

     type option = {
        payeeVPA: string,
        payeeName: string,
        payeeMerchantCode?: string,
        amount?: number,
        minAmount?: number,
        transactionId?: string,
        transactionRef?: string,
        transactionNote?: string,
        transactionRefUrl?: string,
        currency?: string,
    }

    type output = {
        qr : string,
        intent : string,
    }
    export function upiqr (option: option): Promise<output>;
}