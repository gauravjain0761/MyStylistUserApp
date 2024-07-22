import {
  EXPERT_USER_LIST,
  GETALLSERVICES,
  GET_BARBER_LIST,
  ITEM_DETAILS,
  MAIN_SERVICE,
  SEARCH_LIST,
  SEARCH_STYLIST_LIST,
  TIME_SLOT,
  USER_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  getallservices: [],
  userList: [],
  itemDetails: {},
  expertUserList: [],
  barberList: [],
  searchList: [],
  searchStylistList: {},
  timeSlot: {},
  mainService: [],
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
      return { ...state, itemDetails: action?.payload };
    }
    case EXPERT_USER_LIST: {
      return { ...state, expertUserList: action.payload };
    }
    case SEARCH_LIST: {
      return { ...state, searchList: action.payload };
    }
    case SEARCH_STYLIST_LIST: {
      return { ...state, searchStylistList: action.payload };
    }
    case TIME_SLOT: {
      return { ...state, timeSlot: action.payload };
    }
    case MAIN_SERVICE: {
      return { ...state, mainService: action?.payload };
    }
    default:
      return state;
  }
}
