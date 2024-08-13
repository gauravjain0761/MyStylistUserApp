import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import {
  GET_ALL_OFFER,
  GET_ALL_OFFERS,
  GET_ALL_PACKAGES,
  GET_OFFERS_LIST,
  GET_OFFER_DETAILS,
  GET_USER_CAMPAIGN_LIST,
  IS_LOADING,
} from "./dispatchTypes";
import { GET, POST, api } from "../helper/apiConstants";
import { makeAPIRequest } from "../helper/apiGlobal";

export const getAllOffersByUser =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.getAllOffersByUser + `${request?.id}`,
      headers: header,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({
            type: GET_ALL_OFFER,
            payload: result?.data,
          });
        }
      })
      .catch((error: any) => {
        console.log("error", error);
        dispatch({ type: IS_LOADING, payload: false });
      });
  };

export const getAllOffersByLocation =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: request?.isLoading });
    return makeAPIRequest({
      method: POST,
      url: api.allOffersByLocation,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          let data = { ...result?.data, page: request?.data?.page };
          dispatch({
            type: GET_ALL_OFFERS,
            payload: data,
          });
          dispatch({
            type: GET_OFFERS_LIST,
            payload: data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getCampaignExpert =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.campaignExpert,
      headers: header,
      data: request.data,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({
            type: GET_USER_CAMPAIGN_LIST,
            payload: result?.data,
          });
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getOfferDetails =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    return makeAPIRequest({
      method: GET,
      url: api.offerDetails + request.id,
      headers: header,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({
            type: GET_OFFER_DETAILS,
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
