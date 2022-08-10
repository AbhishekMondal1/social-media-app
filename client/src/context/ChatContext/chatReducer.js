export const initialChatState = {
  usersOnline: [],
};

export const chatReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ONLINE_USER":
      return {
        ...state,
        usersOnline: [
          ...new Set([...state.usersOnline, ...action.payload.userId]),
        ],
      };
    case "REMOVE_ONLINE_USER":
      console.log("state", state.usersOnline);
      console.log("payload", action.payload);
      return {
        ...state,
        usersOnline: state.usersOnline.filter(
          (userId) => userId !== action.payload.userId,
        ),
      };
    case "SET_ONLINE_USERS":
      return { ...state, usersOnline: [...action.payload.onlineUsersIds] };
    default:
      return state;
  }
};
