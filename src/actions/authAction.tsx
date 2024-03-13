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
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.send_verify_code,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.data.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data.success) {
            successToast(response?.data?.message);

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
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data.status) {
            setAsyncToken(response.data.userDetails.token);
            setAsyncGuest(false);
            setAsyncUserInfo(response?.data?.userDetails);
            dispatch({
              type: USER_INFO,
              payload: { ...response?.data?.userDetails, isGuest: false },
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
