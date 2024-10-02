import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface RouteState {
    path: string;
    params: {
        key : string;
        value : string;
    }[];
}

const initialState: RouteState = {
     
    path: location.pathname,
    params: [],
};

export const routeSlice = createSlice({
    name: "route",
    initialState,
    reducers: {
        setCurrentRoute: (state, { payload }: PayloadAction<string>) => {
            state.path = payload;
        },
        setRouteParams: (state, { payload }: PayloadAction<any>) => {
            state.params = payload
        },
    }
});


export const { setCurrentRoute , setRouteParams} = routeSlice.actions;

export const selectCurrentRoute = (state: RootState) => state.route.path;
export const selectRouteParams = (state: RootState) => state.route.params;

export default routeSlice.reducer;