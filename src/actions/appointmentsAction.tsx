import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { getAsyncToken } from "../helper/asyncStorage";
import {
  APPOINTMENTS_DETAILS,
  APPOINTMENTS_RESCHEDULE,
  GET_APPOINTMENT,
  GET_APPOINTMENTS_LIST,
  IS_LOADING,
  REVIEW_LIST,
} from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { GET, POST, api } from "../helper/apiConstants";
import { successToast } from "../helper/globalFunction";

export const getUserAppointments =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    console.log("PAGE: ", request?.data?.page);

    dispatch({ type: IS_LOADING, payload: request.isLoading });
    return makeAPIRequest({
      method: POST,
      url: api.userAppointments,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          let data = { ...response.data, page: request?.data?.page };
          dispatch({ type: GET_APPOINTMENTS_LIST, payload: data });
          dispatch({
            type: GET_APPOINTMENT,
            payload: data,
          });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getAppointmentDetails =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.appointmentDetails + request.id,
      headers: headers,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({ type: APPOINTMENTS_DETAILS, payload: response.data });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const writeReview =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.writeReviews,
      headers: headers,
      data: request?.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const cancelAppointment =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.cancelAppointment,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: IS_LOADING, payload: false });
          successToast("Appointment cancelled successfully");
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const rescheduleAppointment =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.reschedule,
      headers: headers,
      data: request.data,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: APPOINTMENTS_RESCHEDULE, payload: response.data });
          dispatch({ type: IS_LOADING, payload: false });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const bookAppointment =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };

    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.bookAppointments,
      headers: header,
      data: request.data,
    })
      .then(async (response: any) => {
        dispatch({ type: IS_LOADING, payload: false });
        console.log("respone", response.data);
        if (response.status === 200 || response.status === 201) {
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };

export const getAllExpertReview =
  (request?: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
      Authorization: await getAsyncToken(),
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.get_review + request.user_id,
      headers: headers,
      params: request.params,
    })
      .then(async (response: any) => {
        if (response.status === 200 || response.status === 201) {
          dispatch({ type: REVIEW_LIST, payload: response.data });
          if (request.onSuccess) request.onSuccess(response.data);
        }
      })
      .catch((error) => {
        if (request.onFailure) request.onFailure(error.response);
      });
  };
