import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";

import { alert } from './reducers/alertReducer';
import { wallet } from "./reducers/walletReducer";


const rootReducer = combineReducers({alert, wallet});
const loggerMiddleware = createLogger();

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);
