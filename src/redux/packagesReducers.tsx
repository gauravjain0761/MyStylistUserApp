import {
  GET_All_PACKAGE_LIST,
  GET_ALL_PACKAGES,
} from "../actions/dispatchTypes";

const initialState = {
  allpackages: [],
  userPackageList: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ALL_PACKAGES: {
      return {
        ...state,
        allpackages: action.payload,
      };
    }
    case GET_All_PACKAGE_LIST: {
      return {
        ...state,
        userPackageList: action.payload,
      };
    }
    default:
      return state;
  }
}
