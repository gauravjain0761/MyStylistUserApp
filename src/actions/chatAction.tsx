import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import {
  GET_CHATS_PARTICIPANTS,
  GET_UNREAD_LIST,
  IS_LOADING,
} from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { GET, POST, api } from "../helper/apiConstants";
import { getAsyncToken } from "../helper/asyncStorage";

export const getChatParticipants =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: GET,
      url: request?.url,
      headers: header,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({
            type: GET_CHATS_PARTICIPANTS,
            payload: result?.data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const createChatRoom =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: POST,
      url: api.room,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const messagesRead =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: POST,
      url: api.messagesReads,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const unReadList =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    return makeAPIRequest({
      method: POST,
      url: api.unreadlist,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({
            type: GET_UNREAD_LIST,
            payload: result?.data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };
