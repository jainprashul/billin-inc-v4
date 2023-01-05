import { createSlice } from "@reduxjs/toolkit";
import { RootState, store } from "../../app/store";

type ServiceWorkerState = {
    isInitialized: boolean;
    isUpdated: boolean;
    isOnline: boolean;
    isOffline: boolean;
    serviceWorkerRegistration: ServiceWorkerRegistration | null;
    showInstallPrompt: boolean;
    promptEvent: any;
};

const initialState: ServiceWorkerState = {
    isInitialized: false,
    isUpdated: false,
    isOnline: false,
    isOffline: false,
    serviceWorkerRegistration: null,
    showInstallPrompt: false,
    promptEvent: null,
};

export const checktheNetworkStatus = () => {
    window.addEventListener("online", () => {
        store.dispatch(online());
    }
    );
    window.addEventListener("offline", () => {
        store.dispatch(offline());
    });

    window.addEventListener("beforeinstallprompt", (e) => {
        e.preventDefault();
        store.dispatch(setInstallPrompt({
            promptEvent: e,
            showInstallPrompt: true,
        }));
    });
}

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

        setInstallPrompt(state, action : { payload: {
            promptEvent: any;
            showInstallPrompt: boolean;
        };}) {
            state.showInstallPrompt = action.payload.showInstallPrompt;
            state.promptEvent = action.payload.promptEvent;
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

export const { initServiceWorker, updateServiceWorker, online, offline, setInstallPrompt } = SWSlice.actions;

export default SWSlice.reducer;

export const selectServiceWorker = (state: RootState) => state.sw.serviceWorkerRegistration;
export const selectSWIsInitialized = (state: RootState) => state.sw.isInitialized;
export const selectSWIsUpdated = (state: RootState) => state.sw.isUpdated;
export const selectSWIsOnline = (state: RootState) => state.sw.isOnline;
export const selectPromptEvent = (state: RootState) => state.sw.promptEvent;
export const selectShowInstallPrompt = (state: RootState) => state.sw.showInstallPrompt;



