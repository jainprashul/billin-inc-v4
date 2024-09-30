import { NAV_WIDTH, USER_MENU, DRAWER_MENU } from "./navbar";

export const DRAWER_WIDTH = 240;
export const APP_NAME = `Billin' Inc`;

export const gstPattern = /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}/;

export {
    NAV_WIDTH, USER_MENU, DRAWER_MENU
}

export const ExpenseTypes = [
    {
        value: "HOUSE_HOLD",
        label: "House Hold"
    },
    {
        value: "VEHICLE",
        label: "Vehicle"
    },
    {
        value: "ELECTRICITY",
        label: "Electricity"
    },
    {
        value: "FOOD",
        label: "Food"
    },
    {
        value: "INTERNET",
        label: "Internet"
    },
    {
        value: "MOBILE",
        label: "Mobile"
    },
    {
        value: "TAXES",
        label: "Taxes"
    },
    {
        value: "SERVICES",
        label: "Services"
    },
    {
        value: "BANKING",
        label: "Banking"
    },
    {
        value: "RENTAL",
        label: "Rental"
    },
    {
        value: "OTHER",
        label: "Others"
    }
] as const;

export const ExpenseModes = [
    {
        value: "CASH",
        label: "Cash"
    },
    {
        value: "CARD",
        label: "Card"
    },
    {
        value: "UPI",
        label: "UPI"
    },
    {
        value: "CHEQUE",
        label: "Cheque"
    },
    {
        value: "NETBANKING",
        label: "Net Banking"
    },
    {
        value: "OTHER",
        label: "Others"
    }
] as const;

export const PRODUCT_UNITS = [ 
    "KG", "GRAM", "LITRE", , "METER", "FEET", "INCH", "PIECE", "PACKET", "BOX", "BOTTLE", "BAG", "OTHER",
] as const;

