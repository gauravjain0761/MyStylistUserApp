import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { GETALLPACKAGEBYUSER, IS_LOADING } from "./dispatchTypes";
import { makeAPIRequest } from "../helper/apiGlobal";
import { GET, api } from "../helper/apiConstants";
import { errorToast } from "../helper/globalFunction";

export const getAllPackageByUser =
  (request: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  async (dispatch) => {
    let header = {
      "Content-Type": "application/json",
    };
    dispatch({ type: IS_LOADING, payload: true });
    return makeAPIRequest({
      method: GET,
      url: api.getAllPackageByUser + `${request?.data}`,
      headers: header,
    })
      .then((result: any) => {
        if (result.status === 200) {
          dispatch({ type: IS_LOADING, payload: false });
          if (result?.data) {
            dispatch({
              type: GETALLPACKAGEBYUSER,
              payload: result?.data,
            });
          } else {
            errorToast(result.data);
          }
          if (request.onSuccess) request.onSuccess(result.data);
        }
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  };
