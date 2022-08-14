export const initialNotificationState = {
  notifications: [],
  newNotification: [],
  unreadCount: 0,
};

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          action.payload.notificationSend[0],
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      };
    case "ADD_NEW_NOTIFICATION":
      return {
        ...state,
        newNotification: [action.payload.notificationSend[0]],
        unreadCount: state.unreadCount + 1,
      };
    case "ADD_NOTIFICATIONS":
      return {
        ...state,
        notifications: [
          ...action.payload.notifications,
          ...state.notifications,
        ],
        unreadCount: state.unreadCount + 1,
      };
    case "READ_NOTIFICATION": {
      const notifications = JSON.parse(JSON.stringify(state.notifications));
      notifications.forEach(
        (notification) =>
          notification._id === action.payload.notificationId &&
          (notification.read = true),
      );
      return {
        ...state,
        unreadCount: 0,
        notifications,
      };
    }
    case "UPDATE_FOLLOWING": {
      const allnotifications = JSON.parse(JSON.stringify(state.notifications));
      allnotifications.forEach((notification) => {
        if (notification._id === action.payload.notificationid) {
          notification.following = action.payload.following;
        }
      });
      return {
        ...state,
        notifications: allnotifications,
      };
    }
    default:
      return state;
  }
};
