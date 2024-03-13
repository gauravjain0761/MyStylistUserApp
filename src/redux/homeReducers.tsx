import { GETALLSERVICES } from "../actions/dispatchTypes";

const initialState = {
  getallservices: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLSERVICES: {
      return { ...state, getallservices: action.payload };
    }
    default:
      return state;
  }
}
