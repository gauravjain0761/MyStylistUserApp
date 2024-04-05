import {
  EXPERT_USER_LIST,
  GETALLSERVICES,
  GET_BARBER_LIST,
  ITEM_DETAILS,
  USER_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  getallservices: [],
  userList: [],
  itemDetails: {},
  expertUserList: [],
  barberList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLSERVICES: {
      return { ...state, getallservices: action.payload };
    }
    case USER_LIST: {
      return { ...state, userList: action.payload };
    }
    case GET_BARBER_LIST: {
      if (action.payload?.page === 1) {
        return { ...state, barberList: action.payload?.users };
      } else {
        return {
          ...state,
          barberList: [...state.barberList, ...action.payload?.users],
        };
      }
    }
    case ITEM_DETAILS: {
      return { ...state, itemDetails: action.payload };
    }
    case EXPERT_USER_LIST: {
      return { ...state, expertUserList: action.payload };
    }
    default:
      return state;
  }
}
