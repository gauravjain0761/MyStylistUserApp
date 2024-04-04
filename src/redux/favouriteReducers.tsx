import { GET_USER_FAV_LIST, SET_FAV_USER } from "../actions/dispatchTypes";

const initialState = {
  favoriteList: [],
  setFavuser: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_USER_FAV_LIST: {
      return { ...state, favoriteList: action.payload };
    }
    case SET_FAV_USER: {
      return { ...state, setFavuser: action.payload };
    }
    default:
      return state;
  }
}
