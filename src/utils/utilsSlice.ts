import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface utils {
    gst: {
        enabled: boolean;
        inclusive: boolean;
    }
}

const initialState: utils = {
    gst: {
        enabled: JSON.parse(localStorage.getItem("gstEnabled") || "false"),
        inclusive: JSON.parse(localStorage.getItem("gstRateInclusive") || "false"),
    }
};


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
    }
});


export default utilsSlice.reducer;
export const { setGstEnabled, setGstRateInclusive } = utilsSlice.actions;
export const selectGstEnabled = (state: RootState) => state.utils.gst.enabled;
export const selectGstRateType = (state: RootState) => state.utils.gst.inclusive;
