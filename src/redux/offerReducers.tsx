import {
  GET_ALL_OFFER,
  GET_ALL_OFFERS,
  GET_USER_CAMPAIGN_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  userOfferList: [],
  allOffers: {},
  usersWithCampaignList: {},
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
    case GET_USER_CAMPAIGN_LIST: {
      return {
        ...state,
        usersWithCampaignList: action.payload,
      };
    }

    default:
      return state;
  }
}
