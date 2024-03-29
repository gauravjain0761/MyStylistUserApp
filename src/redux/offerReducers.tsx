import { GET_ALL_OFFER, GET_ALL_OFFERS } from "../actions/dispatchTypes";

const initialState = {
  userOfferList: [],
  allOffers: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ALL_OFFER: {
      return {
        ...state,
        userOfferList: action.payload,
      };
    }
    case GET_ALL_OFFERS: {
      return {
        ...state,
        allOffers: action.payload,
      };
    }

    default:
      return state;
  }
}
