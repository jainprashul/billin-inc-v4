export interface Customer {
    name: string;
    address: string;
    phone: string;
    email: string;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;

    license: {
        serialKey : string;
        validTill : Date;
        validationDate : Date;
        key : string;
        lisenseType : string;
        version ?: string;
    }
}