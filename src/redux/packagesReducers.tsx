import {
  GET_All_PACKAGE_LIST,
  GET_ALL_PACKAGES,
  GET_PACKAGES_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  allpackages: [],
  userPackageList: {},
  packageList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_ALL_PACKAGES: {
      return {
        ...state,
        allpackages: action.payload,
      };
    }
    case GET_PACKAGES_LIST: {
      if (action.payload?.page === 1) {
        return { ...state, packageList: action.payload?.packages };
      } else {
        return {
          ...state,
          packageList: [...state.packageList, ...action.payload?.packages],
        };
      }
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
