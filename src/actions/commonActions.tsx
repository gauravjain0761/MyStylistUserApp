import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { IS_LOADING, USER_INFO } from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { POST, api } from "../helper/apiConstants";

export const setUserInfo =
  (data: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch({
      type: USER_INFO,
      payload: data,
    });
  };

export const setIsLoading =
  (data: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch({
      type: IS_LOADING,
      payload: data || false,
    });
  };

export const getExpertAvailability =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    return makeAPIRequest({
      method: POST,
      url: api.expertAvailability,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        console.log("HIT", result.status);
        if (result.status === 200) {
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
        if (request.onFailure) request.onFailure(error.response);
      });
  };
