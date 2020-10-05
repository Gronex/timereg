import { StoreEnhancer } from '@reduxjs/toolkit'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk'

import loggerMiddleware from './middleware/logger'
import { rootReducer } from './reducers'

export default function configureStore(preloadedState? : any) {
  const middlewares = [loggerMiddleware, thunkMiddleware];
  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers : StoreEnhancer<{dispatch: unknown}>[] = [middlewareEnhancer];

  const composedEnhancers = composeWithDevTools({

  });

  const store = createStore(
      rootReducer,
      preloadedState,
      composedEnhancers(...enhancers));

  return store;
}