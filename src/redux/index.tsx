import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { USER_LOGOUT } from "../actions/dispatchTypes";
import { configureStore } from "@reduxjs/toolkit";
import authReducers from "./authReducers";
import homeReducers from "./homeReducers";
import commonReducers from "./commonReducers";
import profileReducers from "./profileReducers";
import locationReducer from "./locationReducer";
import offerReducers from "./offerReducers";
import packagesReducers from "./packagesReducers";
import favouriteReducers from "./favouriteReducers";
import appointmentReducer from "./appointmentReducer";

const middleware = [thunk];
const reducers = combineReducers({
  auth: authReducers,
  home: homeReducers,
  common: commonReducers,
  profile: profileReducers,
  location: locationReducer,
  offers: offerReducers,
  package: packagesReducers,
  favourite: favouriteReducers,
  appointment: appointmentReducer,
});

const RootReducer = (state: any, action: any) => {
  if (action.type === USER_LOGOUT) {
    return reducers(undefined, action);
  }
  return reducers(state, action);
};

const store = configureStore({ reducer: RootReducer, middleware: middleware });
export default store;
