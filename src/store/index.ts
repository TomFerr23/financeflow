import { configureStore } from '@reduxjs/toolkit';
import currencyReducer from './currencySlice';
import stocksReducer from './stocksSlice';
import expensesReducer from './expensesSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    currency: currencyReducer,
    stocks: stocksReducer,
    expenses: expensesReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
