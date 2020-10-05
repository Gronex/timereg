import { combineReducers } from "@reduxjs/toolkit";
import { registrationReducer } from "./registration/reducers";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loggerMiddleware from '../middleware/logger';

const rootReducer = combineReducers({
    timeRegistration: registrationReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default function configureAppStore(preloadedState? : any) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState,
    devTools: true
  });

  return store;
}