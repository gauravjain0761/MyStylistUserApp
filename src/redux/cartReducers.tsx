import {
  ADD_TO_CART,
  CART_COUNT,
  CART_DETAILS,
  GETALLSERVICES,
  SELECTED_SERVICE,
  SELECTED_TIME_SLOT,
} from "../actions/dispatchTypes";

const initialState = {
  getallservices: [],
  addtocart: [],
  cartDetails: [],
  cartCount: 0,
  selectedService: [],
  selected_time_slot: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GETALLSERVICES: {
      return { ...state, getallservices: action.payload };
    }
    case ADD_TO_CART: {
      return { ...state, addtocart: action.payload };
    }
    case CART_DETAILS: {
      return { ...state, cartDetails: action.payload };
    }
    case CART_COUNT: {
      return { ...state, cartCount: action.payload };
    }
    case SELECTED_SERVICE: {
      return { ...state, selectedService: action?.payload };
    }
    case SELECTED_TIME_SLOT: {
      return { ...state, selected_time_slot: action?.payload };
    }
    default:
      return state;
  }
}
