import {
  GET_ALL_OFFER,
  GET_ALL_OFFERS,
  GET_OFFERS_LIST,
  GET_OFFER_DETAILS,
  GET_USER_CAMPAIGN_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  userOfferList: [],
  allOffers: {},
  usersWithCampaignList: {},
  offerList: [],
  offerDetails: {},
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
    case GET_OFFERS_LIST: {
      if (action.payload?.page === 1) {
        return { ...state, offerList: action.payload?.offers };
      } else {
        return {
          ...state,
          offerList: [...state.offerList, ...action.payload?.offers],
        };
      }
    }
    case GET_USER_CAMPAIGN_LIST: {
      return {
        ...state,
        usersWithCampaignList: action.payload,
      };
    }
    case GET_OFFER_DETAILS: {
      return {
        ...state,
        offerDetails: action.payload,
      };
    }

    default:
      return state;
  }
}
