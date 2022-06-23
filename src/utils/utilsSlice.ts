import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface utils {
    gstEnabled: boolean;
}

const initialState: utils = {
    gstEnabled: JSON.parse(localStorage.getItem("gstEnabled") || "false"),
};


export const utilsSlice = createSlice({
    initialState,
    name: "utils",
    reducers: {
        setGstEnabled: (state, { payload }) => {
            state.gstEnabled = payload;
            localStorage.setItem("gstEnabled", JSON.stringify(payload));
        }
    }
});


export default utilsSlice.reducer;
export const { setGstEnabled } = utilsSlice.actions;
export const selectGstEnabled = (state: RootState) => state.utils.gstEnabled;