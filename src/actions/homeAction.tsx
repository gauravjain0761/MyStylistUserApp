import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { GETALLSERVICES, IS_LOADING } from "./dispatchTypes";
import { GET, api } from "../helper/apiConstants";
import { makeAPIRequest } from "../helper/apiGlobal";
import { errorToast } from "../helper/globalFunction";

export const getAllServices =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.allServices,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          if (response.data.status) {
            dispatch({
              type: GETALLSERVICES,
              payload: response?.data?.categories,
            });
          } else {
            errorToast(response.data.message);
          }
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getAllBanner =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.allbanners,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          request?.onSuccess(response?.data);
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
