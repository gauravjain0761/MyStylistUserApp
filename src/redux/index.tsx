import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { USER_LOGOUT } from "../actions/dispatchTypes";
import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./authReducers";
import homeReducers from "./homeReducers";
import commonReducers from "./commonReducers";
import profileReducers from "./profileReducers";

const middleware = [thunk];
const reducers = combineReducers({
  auth: authReducers,
  home: homeReducers,
  common: commonReducers,
  profile: profileReducers,
});

const RootReducer = (state: any, action: any) => {
  if (action.type === USER_LOGOUT) {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = configureStore({ reducer: RootReducer, middleware: middleware });
export default store;
