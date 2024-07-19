import {
  GET_ADDRESS_LIST,
  GET_CHATS_PARTICIPANTS,
  LOCATION,
  SET_DEFAULT_ADDRESS,
} from "../actions/dispatchTypes";

const initialState = {
  addressList: [],
  location: {},
  defaultAddress: "",
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
    default:
      return state;
  }
}
