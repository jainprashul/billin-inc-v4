import { createSlice } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../app/store";
import authService from "../services/authentication/auth.service";
import { Usr } from "../services/database/model";

interface utils {
    gst: {
        enabled: boolean;
        inclusive: boolean;
    }
    isLoggedIn: boolean;
    user : Usr | null
        
}

const initialState: utils = {
    gst: {
        enabled: JSON.parse(localStorage.getItem("gstEnabled") || "false"),
        inclusive: JSON.parse(localStorage.getItem("gstRateInclusive") || "false"),
    },
    isLoggedIn: false,
    user : null
};

export const checkLogin = () : AppThunk  => (dispatch, getState ) => {
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
        setUser : (state, action: {payload : Usr | null})  => {
            state.user = action.payload
        }
    }
});


export default utilsSlice.reducer;
export const { setGstEnabled, setGstRateInclusive, setLoginStatus, setUser } = utilsSlice.actions;
export const selectGstEnabled = (state: RootState) => state.utils.gst.enabled;
export const selectGstRateType = (state: RootState) => state.utils.gst.inclusive;
export const selectIsLoggedIn = (state: RootState) => state.utils.isLoggedIn;
export const selectUser = (state : RootState) => state.utils.user;
export const selectIsAdmin = (state : RootState) => state.utils.user?.roleID === 1;
