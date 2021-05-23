import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";

import { alert } from "./reducers/alertReducer";
import { wallet } from "./reducers/walletReducer";
import { proposal } from "./reducers/proposalReducer";

const rootReducer = combineReducers({alert, wallet, proposal});
const loggerMiddleware = createLogger();

export const store = createStore(
    rootReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
