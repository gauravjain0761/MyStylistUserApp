import {
  GETALLPACKAGEBYUSER,
  GET_ALL_PACKAGES,
} from "../actions/dispatchTypes";

const initialState = {
  allpackages: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ALL_PACKAGES: {
      return {
        ...state,
        allpackages: action.payload,
      };
    }
    default:
      return state;
  }
}
