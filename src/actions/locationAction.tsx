import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { COORD, IS_LOADING, UPDATELOCATION } from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { POST, api } from "../helper/apiConstants";
import { screenName } from "../helper/routeNames";
import { dispatchNavigation } from "../helper/globalFunction";

export const updateLocation =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let headers = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: POST,
      url: api.updatelocation,
      headers: headers,
      data: request,
    })
      .then(async (response: any) => {
        if (response?.status == 200) {
          console.log("Post Update Location API RES", response?.data);
          dispatch({ type: IS_LOADING, payload: false });
          dispatch({ type: UPDATELOCATION, payload: request });
          dispatchNavigation(screenName?.Home);
        }
      })
      .catch((error) => {
        dispatch({ type: IS_LOADING, payload: false });
        if (request.onFailure) request.onFailure(error.response);
      });
  };
