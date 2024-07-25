import {
  COORD,
  NOTIFICATION,
  SETLOCATION,
  UPDATELOCATION,
} from "../actions/dispatchTypes";

const initialState = {
  notification_list: [],
};

export default function (state = initialState, action: any) {
  switch (action?.type) {
    case NOTIFICATION:
      return { ...state, notification_list: action?.payload };
    default:
      return state;
  }
}
