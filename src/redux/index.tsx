import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { USER_LOGOUT } from "../actions/dispatchTypes";
import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./authReducers";
import homeReducers from "./homeReducers";

const middleware = [thunk];
const reducers = combineReducers({
  auth: authReducers,
  home: homeReducers,
});

const RootReducer = (state: any, action: any) => {
  if (action.type === USER_LOGOUT) {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = configureStore({ reducer: RootReducer, middleware: middleware });
export default store;
