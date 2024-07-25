import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { IS_LOADING, NOTIFICATION } from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { POST, api } from "../helper/apiConstants";
import { getAsyncToken } from "../helper/asyncStorage";

export const getNotificationList =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api?.notification,
      headers: headers,
      data: request?.data,
    })
      .then(async (response: any) => {
        if (response?.status == 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({
            type: NOTIFICATION,
            payload: response?.data?.notifications,
          });
          if (request.onSuccess) request.onSuccess(response);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure("eeeee", error.response);
      });
  };
