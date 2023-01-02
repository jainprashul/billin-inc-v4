import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import authService from "../services/authentication/auth.service";
import { NotificationLog, Usr } from "../services/database/model";

interface CountMetric {
    total: number;
    count: number;
    amount: number;
    totalAmount: number;
    deltaPercent: number;
}
interface utils {
    gst: {
        enabled: boolean;
        inclusive: boolean;
    }
    isLoggedIn: boolean;
    user: Usr | null,
    salesData: {
        date: string;
        salesCount: number;
        purchaseCount: number;
        sAmount: number;
        pAmount: number;
    }[]

    notification: NotificationLog[]

    count: {
        sales: CountMetric;
        purchase: CountMetric;
        expenses: CountMetric;
        stocks: {
            count: number;
            totalValue: number;
        }
    }
}

const initialState: utils = {
    gst: {
        enabled: JSON.parse(localStorage.getItem("gstEnabled") || "false"),
        inclusive: JSON.parse(localStorage.getItem("gstRateInclusive") || "false"),
    },
    isLoggedIn: false,
    user: null,
    salesData: [],
    notification: [],

    count: {
        sales: {
            total: 0,
            count: 0,
            amount: 0,
            totalAmount: 0,
            deltaPercent: 0
        },
        purchase: {
            total: 0,
            count: 0,
            amount: 0,
            totalAmount: 0,
            deltaPercent: 0
        },
        expenses: {
            total: 0,
            count: 0,
            amount: 0,
            totalAmount: 0,
            deltaPercent: 0
        },
        stocks: {
            count: 0,
            totalValue: 0
        }
    }

};

export const checkLogin = (): AppThunk => (dispatch, getState) => {
    const user = authService.getUser()
    if (user) {
        dispatch(setLoginStatus(true));
        dispatch(setUser(user))
    }
}



export const utilsSlice = createSlice({
    initialState,
    name: "utils",
    reducers: {
        setGstEnabled: (state, action: { payload: boolean }) => {
            state.gst.enabled = action.payload;
            localStorage.setItem("gstEnabled", JSON.stringify(action.payload));
            if (action.payload === false) {
                state.gst.inclusive = false;
                localStorage.setItem("gstRateInclusive", JSON.stringify(false));
            }
        },
        setGstRateInclusive: (state, action: { payload: boolean }) => {
            state.gst.inclusive = action.payload;
            localStorage.setItem("gstRateInclusive", JSON.stringify(action.payload));
        },
        setLoginStatus: (state, action: { payload: boolean }) => {
            state.isLoggedIn = action.payload;
        },
        setUser: (state, action: { payload: Usr | null }) => {
            state.user = action.payload
        },
        setSalesData: (state, action: { payload: any[] }) => {
            state.salesData = action.payload
        },
        setNotification: (state, action: { payload: NotificationLog[] }) => {
            state.notification = action.payload
        },
        setCount: (state, action: { payload: any }) => {
            state.count = action.payload
        }
    }
});


export default utilsSlice.reducer;
export const { setGstEnabled, setGstRateInclusive, setLoginStatus, setUser, setSalesData, setNotification, setCount } = utilsSlice.actions;

export const selectGstEnabled = (state: RootState) => state.utils.gst.enabled;
export const selectGstRateType = (state: RootState) => state.utils.gst.inclusive;
export const selectIsLoggedIn = (state: RootState) => state.utils.isLoggedIn;
export const selectUser = (state: RootState) => state.utils.user;
export const selectIsAdmin = (state: RootState) => state.utils.user?.roleID === 1;

export const selectSalesData = (state: RootState) => state.utils.salesData;

export const selectSalesCount = (state: RootState) => state.utils.count.sales;
export const selectPurchaseCount = (state: RootState) => state.utils.count.purchase;
export const selectExpenseCount = (state: RootState) => state.utils.count.expenses;
export const selectStockCount = (state: RootState) => state.utils.count.stocks;