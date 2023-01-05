import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

type ServiceWorkerState = {
    isInitialized: boolean;
    isUpdated: boolean;
    isOnline: boolean;
    isOffline: boolean;
    serviceWorkerRegistration: ServiceWorkerRegistration | null;
};

const initialState: ServiceWorkerState = {
    isInitialized: false,
    isUpdated: false,
    isOnline: false,
    isOffline: false,
    serviceWorkerRegistration: null,
};

const SWSlice = createSlice({
    name: "ServiceWorker",
    initialState: initialState,
    reducers: {
        initServiceWorker(state, action : { payload: ServiceWorkerRegistration;}) {
            state.isInitialized = true;
            state.serviceWorkerRegistration = action.payload;
        },

        updateServiceWorker(state, action : { payload: ServiceWorkerRegistration;}) {
            state.isUpdated = true;
            state.serviceWorkerRegistration = action.payload;
        },

        online(state) {
            state.isOnline = true;
            state.isOffline = false;
        },

        offline(state) {
            state.isOnline = false;
            state.isOffline = true;
        }
    },
})

export const { initServiceWorker, updateServiceWorker, online, offline } = SWSlice.actions;

export default SWSlice.reducer;

export const selectServiceWorker = (state: RootState) => state.sw.serviceWorkerRegistration;
export const selectSWIsInitialized = (state: RootState) => state.sw.isInitialized;
export const selectSWIsUpdated = (state: RootState) => state.sw.isUpdated;
export const selectSWIsOnline = (state: RootState) => state.sw.isOnline;



