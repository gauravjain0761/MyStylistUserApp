import { GET_FAQ } from "../actions/dispatchTypes";

const initialState = {
  getallfaqs: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_FAQ: {
      return { ...state, getallfaqs: action.payload };
    }
    default:
      return state;
  }
}
