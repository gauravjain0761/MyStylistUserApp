import { COORD, SETLOCATION, UPDATELOCATION } from "../actions/dispatchTypes";

const initialState = {
  location: {},
  updatelocation: {},
  coord: {},
};

export default function (state = initialState, action: any) {
  switch (action?.type) {
    case SETLOCATION:
      return { ...state, location: action?.payload };
    case UPDATELOCATION:
      return { ...state, updatelocation: action?.payload };
    case COORD:
      return { ...state, coord: action?.payload };
    default:
      return state;
  }
}
