import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { GET, POST, api } from "../helper/apiConstants";
import { makeAPIRequest } from "../helper/apiGlobal";
import {
  GET_FAQ,
  GET_PROFILE_DATA,
  GET_TERMSANDCONDITIONS,
  IS_LOADING,
} from "./dispatchTypes";

export const getAllFAQ =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.FAQ,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (response.status === 200) {
          dispatch({ type: GET_FAQ, payload: response?.data });
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getTermsAndCondtition =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.termsandconditions,
      headers: header,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (response.status === 200) {
          dispatch({
            type: GET_TERMSANDCONDITIONS,
            payload: response?.data?.data,
          });
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getUserDetails =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: request?.isLoading });
    return makeAPIRequest({
      method: POST,
      url: api.userDetails,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (response.status === 200) {
          console.log("response", response);

          dispatch({
            type: GET_PROFILE_DATA,
            payload: response?.data,
          });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
