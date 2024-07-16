import {
  GET_ADDRESS_LIST,
  GET_CHATS_PARTICIPANTS,
  LOCATION,
} from "../actions/dispatchTypes";

const initialState = {
  addressList: {},
  location: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ADDRESS_LIST: {
      return { ...state, addressList: action?.payload };
    }
    case LOCATION: {
      return { ...state, location: action?.payload };
    }
    default:
      return state;
  }
}
