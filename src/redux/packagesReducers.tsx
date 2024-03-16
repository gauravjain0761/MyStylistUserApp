import { GETALLPACKAGEBYUSER } from "../actions/dispatchTypes";

const initialState = {
  getallpackages: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLPACKAGEBYUSER: {
      return {
        ...state,
        getallpackages: action.payload,
      };
    }

    default:
      return state;
  }
}
