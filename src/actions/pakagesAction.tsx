import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import {
  GET_All_PACKAGE_LIST,
  GET_ALL_PACKAGES,
  GET_PACKAGES_LIST,
  IS_LOADING,
} from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { GET, POST, api } from "../helper/apiConstants";

export const getAllPackageByUser =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.getAllPackageByUser + `${request?.id}`,
      headers: header,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({
            type: GET_All_PACKAGE_LIST,
            payload: result?.data,
          });

          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getAllPackageByLocation =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: request?.isLoading });
    return makeAPIRequest({
      method: POST,
      url: api.allPackageByLocation,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          let data = { ...result?.data, page: request?.data.page };
          dispatch({
            type: GET_ALL_PACKAGES,
            payload: data,
          });
          dispatch({
            type: GET_PACKAGES_LIST,
            payload: data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
