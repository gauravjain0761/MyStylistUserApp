import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { IS_LOADING, USER_INFO } from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { POST, api } from "../helper/apiConstants";
import {
  setAsyncGuest,
  setAsyncToken,
  setAsyncUserInfo,
} from "../helper/asyncStorage";
import { errorToast, otpToast, successToast } from "../helper/globalFunction";

export const sendVerifyCode =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    console.log(request);
    let headers = {
      "Content-Type": "application/json",
    };
    return makeAPIRequest({
      method: POST,
      url: api.send_verify_code,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.data.status === 200) {
          if (response.data.success) {
            successToast(response?.data?.message);
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            errorToast(response.data.message);
          }
        }
      })
      .catch((error) => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const verifyOTP =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.verify_OTP,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data.status) {
            setAsyncToken(response?.data?.token);
            setAsyncGuest(false);
            setAsyncUserInfo(response?.data);
            dispatch({
              type: USER_INFO,
              payload: { ...response?.data, isGuest: false },
            });
            if (request.onSuccess) request.onSuccess(response.data);
          } else {
            errorToast(response.data.message);
          }
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const Citylist =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.city,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          errorToast(response.data?.status);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getrefreshToken =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    return makeAPIRequest({
      method: POST,
      url: api.refreshToken,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onSuccess) request.onSuccess(response.data);
        } else {
          errorToast(response.data?.status);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
