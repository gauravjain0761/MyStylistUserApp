import {
  GET_CHATS_PARTICIPANTS,
  GET_UNREAD_LIST,
} from "../actions/dispatchTypes";

const initialState = {
  chatParticipants: {},
  unreadList: [],
};

export default function (state = initialState, action: any) {
  switch (action.type) {
    case GET_CHATS_PARTICIPANTS: {
      return { ...state, chatParticipants: action?.payload };
    }
    case GET_UNREAD_LIST: {
      return { ...state, unreadList: action?.payload };
    }
    default:
      return state;
  }
}
