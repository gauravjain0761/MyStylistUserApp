import { GETALLOFFERSBYUSER, GET_ALL_OFFERS } from "../actions/dispatchTypes";

const initialState = {
  getalloffers: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLOFFERSBYUSER: {
      return {
        ...state,
        getalloffers: action.payload,
      };
    }
    case GET_ALL_OFFERS: {
      return {
        ...state,
        getalloffers: action.payload,
      };
    }

    default:
      return state;
  }
}
