import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { CART_DETAILS, IS_LOADING } from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { POST, api } from "../helper/apiConstants";

export const addToCart =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };

    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.cart,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        console.log("respone", response.data);
        if (response.status === 200 || response.status === 201) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const removeToCart =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };

    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.removeTocart,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        console.log("respone", response.data);
        if (response.status === 200 || response.status === 201) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getCartlist =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };

    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.getCart,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        console.log("respone", response.data);
        if (response.status === 200 || response.status === 201) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const bookAppointment =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };

    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.bookAppointments,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        console.log("respone", response.data);
        if (response.status === 200 || response.status === 201) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
