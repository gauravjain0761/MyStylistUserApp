import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { GET, api } from "../helper/apiConstants";
import { makeAPIRequest } from "../helper/apiGlobal";
import { IS_LOADING } from "./dispatchTypes";

export const getAllFAQ =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    return makeAPIRequest({
      method: GET,
      url: api.FAQ,
      headers: header,
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          return response.data;
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
