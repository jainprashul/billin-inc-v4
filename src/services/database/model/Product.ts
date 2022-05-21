export interface Product {
    id?: number;
    name : string;
    categoryID? : number;
    gstRate : GstRate;
    hsn : string;
    price : number;
    quantity : number;
    unit : ProductUnit;
    gstAmount : number;
    totalAmont : number; 
}

export enum ProductUnit {
    KG = "KG",
    L = "L",
    PCS = "PCS",
    BOX = "BOX",
    BAG = "BAG",
    BOTTLE = "BOTTLE",
    CARTON = "CARTON"
}

type GstRate = 0 | 5 | 12 | 18 | 28;


