import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

import { alert } from "./reducers/alertReducer";
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