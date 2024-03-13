import { IS_LOADING, USER_INFO } from "../actions/dispatchTypes";

const initialState = {
  userInfo: {},
  isLoading: false,
};

export default function (state = initialState, action: any) {
  switch (action?.type) {
    case IS_LOADING: {
      return { ...state, isLoading: action.payload };
    }
    case USER_INFO: {
      return { ...state, userInfo: action.payload };
    }
    default:
      return state;
  }
}
