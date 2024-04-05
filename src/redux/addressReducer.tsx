import {
  GET_ADDRESS_LIST,
  GET_CHATS_PARTICIPANTS,
} from "../actions/dispatchTypes";

const initialState = {
  addressList: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ADDRESS_LIST: {
      return { ...state, addressList: action.payload };
    }
    default:
      return state;
  }
}
