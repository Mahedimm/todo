import { combineReducers } from "redux";

import counter from "@redux/slices/counter";
import loader from "@redux/slices/loader";

import { store } from "./store";

const rootReducer = combineReducers({ counter, loader });

export type RootState = ReturnType<typeof store.getState>;

export default rootReducer;
