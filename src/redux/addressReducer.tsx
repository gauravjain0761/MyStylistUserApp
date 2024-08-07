import {
  CURRENT_COORDS,
  GET_ADDRESS_LIST,
  GET_CHATS_PARTICIPANTS,
  LOCATION,
  SET_DEFAULT_ADDRESS,
} from "../actions/dispatchTypes";

const initialState = {
  addressList: [],
  location: {},
  defaultAddress: "",
  currentCoords: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ADDRESS_LIST: {
      return { ...state, addressList: action?.payload };
    }
    case LOCATION: {
      return { ...state, location: action?.payload };
    }
    case SET_DEFAULT_ADDRESS: {
      return { ...state, defaultAddress: action?.payload };
    }
    case CURRENT_COORDS: {
      return { ...state, currentCoords: action?.payload };
    }
    default:
      return state;
  }
}
