import { GET_USER_FAV_LIST } from "../actions/dispatchTypes";

const initialState = {
  favoriteList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_USER_FAV_LIST: {
      return { ...state, favoriteList: action.payload };
    }
    default:
      return state;
  }
}
