import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import {
  GET_ADDRESS_LIST,
  GET_CHATS_PARTICIPANTS,
  IS_LOADING,
} from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { GET, POST, api } from "../helper/apiConstants";
import { getAsyncToken } from "../helper/asyncStorage";

export const getUserAddresses =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: request?.isLoading });
    return makeAPIRequest({
      method: POST,
      url: api.userAddresses,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({
            type: GET_ADDRESS_LIST,
            payload: result?.data?.data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const deleteAddress =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.unsetUserAddress,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const editAddress =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.editUserAddress,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
