import { ThunkAction } from "redux-thunk";
import { RootState } from "../helper/Types";
import { AnyAction } from "redux";
import { IS_LOADING, USER_INFO } from "./dispatchTypes";

export const setUserInfo =
  (data: any): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch({
      type: USER_INFO,
      payload: data,
    });
  };

export const setIsLoading =
  (data: boolean): ThunkAction<void, RootState, unknown, AnyAction> =>
  (dispatch) => {
    dispatch({
      type: IS_LOADING,
      payload: data || false,
    });
  };
