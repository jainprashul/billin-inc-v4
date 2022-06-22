import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

export interface RouteState {
    path: string;
    params: any;
}

const initialState: RouteState = {
    // eslint-disable-next-line no-restricted-globals
    path: location.pathname,
    params: {},
};

export const routeSlice = createSlice({
    name: "route",
    initialState,
    reducers: {
        setCurrentRoute: (state, { payload }: PayloadAction<string>) => {
            state.path = payload
        }
    }
});


export const { setCurrentRoute } = routeSlice.actions;

export const selectCurrentRoute = (state: RootState) => state.route.path;

export default routeSlice.reducer;