import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import routeReducer from '../routes/routeSlice';
import utilsReducer from '../utils/utilsSlice';
import swReducer from '../utils/service/swSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    route: routeReducer,
    utils : utilsReducer,
    sw : swReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
