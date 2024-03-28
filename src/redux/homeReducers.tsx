import { GETALLSERVICES, USER_LIST } from "../actions/dispatchTypes";

const initialState = {
  getallservices: [],
  userList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLSERVICES: {
      return { ...state, getallservices: action.payload };
    }
    case USER_LIST: {
      return { ...state, userList: action.payload };
    }
    default:
      return state;
  }
}
