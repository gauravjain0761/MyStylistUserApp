import {
  GET_FAQ,
  GET_PROFILE_DATA,
  GET_TERMSANDCONDITIONS,
} from "../actions/dispatchTypes";

const initialState = {
  getallfaqs: [],
  getalltermsandconditions: [],
  profileData: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_FAQ: {
      return { ...state, getallfaqs: action.payload };
    }
    case GET_TERMSANDCONDITIONS: {
      return { ...state, getalltermsandconditions: action.payload };
    }
    case GET_PROFILE_DATA: {
      return { ...state, profileData: action.payload };
    }
    default:
      return state;
  }
}
