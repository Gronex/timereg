import { combineReducers } from "@reduxjs/toolkit";
import { registrationReducer } from "./registration/reducers";
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import loggerMiddleware from '../middleware/logger';
import { systemReducer } from "./system/reducer";

import { Repository } from '../../services/repository';

async function preloadState() {
  const repo = await Repository.getCurrent();
  const registrations = await repo.getRegistrations()
  return {
    timeRegistration: {
      registrations: registrations.map(x => ({
        dateStamp: x.date.setHours(0, 0, 0, 0),
        time: x.hours,
        description: x.description,
        id: x.id,
        project: x.project
      }))
    }
  }
}

const rootReducer = combineReducers({
    timeRegistration: registrationReducer,
    system: systemReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default async function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [loggerMiddleware, ...getDefaultMiddleware()],
    preloadedState: await preloadState(),
    devTools: process.env.NODE_ENV !== 'production'
  });

  return store;
}