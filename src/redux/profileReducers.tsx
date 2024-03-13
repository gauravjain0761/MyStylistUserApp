import { GET_FAQ, GET_TERMSANDCONDITIONS } from "../actions/dispatchTypes";

const initialState = {
  getallfaqs: [],
  getalltermsandconditions: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_FAQ: {
      return { ...state, getallfaqs: action.payload };
    }
    case GET_TERMSANDCONDITIONS: {
      return { ...state, getalltermsandconditions: action.payload };
    }
    default:
      return state;
  }
}
