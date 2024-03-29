import {
  GETALLSERVICES,
  ITEM_DETAILS,
  USER_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  getallservices: [],
  userList: [],
  itemDetails: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLSERVICES: {
      return { ...state, getallservices: action.payload };
    }
    case USER_LIST: {
      return { ...state, userList: action.payload };
    }
    case ITEM_DETAILS: {
      return { ...state, itemDetails: action.payload };
    }
    default:
      return state;
  }
}
