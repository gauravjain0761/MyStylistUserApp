import { GET_CHATS_PARTICIPANTS } from "../actions/dispatchTypes";

const initialState = {
  chatParticipants: {},
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_CHATS_PARTICIPANTS: {
      return { ...state, chatParticipants: action.payload };
    }
    default:
      return state;
  }
}
