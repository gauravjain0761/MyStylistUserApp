import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { GET_USER_FAV_LIST, IS_LOADING } from "./dispatchTypes";
import { GET, POST, api } from "../helper/apiConstants";
import { makeAPIRequest } from "../helper/apiGlobal";
import { errorToast } from "../helper/globalFunction";
import { getAsyncToken } from "../helper/asyncStorage";

export const getUsersFavList =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      // Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.getUsersFavList,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({
            type: GET_USER_FAV_LIST,
            payload: result?.data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const saveAsfavourite =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.saveAsfavourite,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (response.status === 200) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
