import { GET_APPOINTMENT, REVIEW_LIST } from "../actions/dispatchTypes";
import {
  APPOINTMENTS_DETAILS,
  APPOINTMENTS_RESCHEDULE,
  GET_APPOINTMENTS_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  appointmentList: {},
  appointmentDetails: {},
  appointment: [],
  appointmentReschedule: {},
  reviewData: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_APPOINTMENTS_LIST: {
      return { ...state, appointmentList: action.payload };
    }
    case GET_APPOINTMENT: {
      if (action.payload?.page === 1) {
        return { ...state, appointment: action.payload?.appointments };
      } else {
        return {
          ...state,
          appointment: [...state.appointment, ...action.payload?.appointments],
        };
      }
    }
    case APPOINTMENTS_DETAILS: {
      return { ...state, appointmentDetails: action.payload };
    }
    case APPOINTMENTS_RESCHEDULE: {
      return { ...state, appointmentReschedule: action.payload };
    }
    case REVIEW_LIST: {
      return { ...state, reviewData: action.payload };
    }
    default:
      return state;
  }
}
