import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import authService from "../services/authentication/auth.service";
import { getConfig } from "../services/database/db";
import { NotificationLog, Usr } from "../services/database/model";

interface CountMetric {
    total: number;
    count: number;
    amount: number;
    totalAmount: number;
    deltaPercent: number;
}

export type TopSelling = {
    id: string;
    name: string;
    quantity: number;
}

export type Sales = {
    date: string;
    salesCount: number;
    purchaseCount: number;
    sAmount: number;
    pAmount: number;
}

interface utils {
    settings: {
        gst: {
            enabled: boolean;
            inclusive: boolean;
        }
    }
    isLoggedIn: boolean;
    user: Usr | null,
    salesData: Sales[]

    topSelling: TopSelling[]

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

    firstTime: boolean;
}

const initialState: utils = {
    settings: {
        gst: {
            enabled: false,
            inclusive: true,
        },
    },
    isLoggedIn: false,
    user: null,
    salesData: [],
    topSelling: [],
    notification: [],

    firstTime: true,
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

export const onStart = (): AppThunk => async (dispatch, getState) => {
    // get auth status and user
    const user = authService.getUser()
    if (user) {
        dispatch(setLoginStatus(true));
        dispatch(setUser(user))
    }

    // load settings from db
    const confg = (await getConfig())
    const settings = confg.settings
    dispatch(setGstEnabled(settings.gstEnabled));
    dispatch(setGstRateInclusive(settings.gstRateInclusive));
    dispatch(setFirstTime(confg.firstTime));

}



export const utilsSlice = createSlice({
    initialState,
    name: "utils",
    reducers: {
        setGstEnabled: (state, action: { payload: boolean }) => {

            const gst = {
                enabled: action.payload,
                inclusive: !action.payload ? false : state.settings.gst.inclusive
            }
            state.settings.gst = gst;
            // localStorage.setItem("gstEnabled", JSON.stringify(gst.enabled));
            // localStorage.setItem("gstRateInclusive", JSON.stringify(gst.inclusive));

            // update db
            getConfig().then((config) => {
                config.settings.gstEnabled = gst.enabled;
                config.settings.gstRateInclusive = gst.inclusive;
                config.save();
                console.log("updated settings")
            })

        },
        setGstRateInclusive: (state, action: { payload: boolean }) => {
            state.settings.gst.inclusive = action.payload;
            // localStorage.setItem("gstRateInclusive", JSON.stringify(action.payload));
            // update db
            getConfig().then((config) => {
                config.settings.gstRateInclusive = action.payload;
                config.save();
                console.log("updated settings")
            })
        },
        setLoginStatus: (state, action: { payload: boolean }) => {
            state.isLoggedIn = action.payload;
        },
        setUser: (state, action: { payload: Usr | null }) => {
            state.user = action.payload
        },
        setSalesData: (state, action: { payload: Sales[] }) => {
            state.salesData = action.payload
        },
        setTopSelling: (state, action: { payload: TopSelling[] }) => {
            state.topSelling = action.payload
        },
        setNotification: (state, action: { payload: NotificationLog[] }) => {
            state.notification = action.payload
        },
        setCount: (state, action: { payload: any }) => {
            state.count = action.payload
        },
        setFirstTime: (state, action: { payload: boolean }) => {
            state.firstTime = action.payload
            // update db
            getConfig().then((config) => {
                config.firstTime = action.payload;
                config.save();
                console.log("updated settings")
            })
        }
    }
});


export default utilsSlice.reducer;
export const { setGstEnabled, setGstRateInclusive, setLoginStatus, setUser, setSalesData, setTopSelling, setFirstTime, setNotification, setCount } = utilsSlice.actions;

export const selectGstEnabled = (state: RootState) => state.utils.settings.gst.enabled;
export const selectGstRateType = (state: RootState) => state.utils.settings.gst.inclusive;
export const selectIsLoggedIn = (state: RootState) => state.utils.isLoggedIn;
export const selectUser = (state: RootState) => state.utils.user;
export const selectIsAdmin = (state: RootState) => state.utils.user?.roleID === 1;

export const selectSalesData = (state: RootState) => state.utils.salesData;

export const selectSalesCount = (state: RootState) => state.utils.count.sales;
export const selectPurchaseCount = (state: RootState) => state.utils.count.purchase;
export const selectExpenseCount = (state: RootState) => state.utils.count.expenses;
export const selectStockCount = (state: RootState) => state.utils.count.stocks;

export const selectTopSelling = (state: RootState) => state.utils.topSelling;
export const selectTop5Selling = (state: RootState) => state.utils.topSelling.slice(0, 5);

export const selectFirstTime = (state: RootState) => state.utils.firstTime;