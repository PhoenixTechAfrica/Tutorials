import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunkMiddleware from "redux-thunk";

import { alert } from './reducers/alertReducer';
import { profile } from "./reducers/profileReducer";
import { proposal } from './reducers/proposalReducer';


const rootReducer = combineReducers({profile, proposal, alert});
const loggerMiddleware = createLogger();

export const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    loggerMiddleware
  )
);
