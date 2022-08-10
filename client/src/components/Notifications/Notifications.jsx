import React, { useContext } from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import "./notifications.css";
import { authHeader } from "../../services/authHeaderConfig";
import { UserContext } from "../../context/UserContext/UserContext";
import { SocketContext } from "../../context/SocketContext/SocketContext";
import { NotificationContext } from "../../context/NotificationContext/NotificationContext";

const Notifications = ({ notification }) => {
  const { userState, userDispatch } = useContext(UserContext);
  const { socketState } = useContext(SocketContext);
  const { notificationDispatch } = useContext(NotificationContext);

  const followUser = (userid) => {
    socketState.notificationSocket?.emit("sendNotification", {
      senderId: userState._id,
      receiverId: userid,
      notificationType: "follow",
      postId: userState._id,
    });
    axios
      .put(
        "/follow",
        {
          followId: userid,
        },
        {
          headers: authHeader(),
        },
      )
      .then((res) => res.data)
      .then((data) => {
        notificationDispatch({
          type: "UPDATE_FOLLOWING",
          payload: {
            following: data.follows,
            notificationid: notification._id,
          },
        });
        userDispatch({
          type: "UPDATE_FOLLOWING",
          payload: { totalFollowing: userState.totalFollowing + 1 },
        });
        const localStorageUser = JSON.parse(localStorage.getItem("user"));
        localStorageUser.totalFollowing = localStorageUser.totalFollowing + 1;
        localStorage.setItem("user", JSON.stringify(localStorageUser));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const unfollowUser = (userid) => {
    axios
      .put(
        "/unfollow",
        {
          unfollowId: userid,
        },
        {
          headers: authHeader(),
        },
      )
      .then((res) => res.data)
      .then((data) => {
        notificationDispatch({
          type: "UPDATE_FOLLOWING",
          payload: {
            following: data.follows,
            notificationid: notification._id,
          },
        });
        userDispatch({
          type: "UPDATE_FOLLOWING",
          payload: { totalFollowing: userState.totalFollowing - 1 },
        });
        const localStorageUser = JSON.parse(localStorage.getItem("user"));
        localStorageUser.totalFollowing = localStorageUser.totalFollowing - 1;
        localStorage.setItem("user", JSON.stringify(localStorageUser));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      {notification && (
        <div className="notification-container">
          <div>
            <Link to={`/profile/${notification.sender?._id}`}>
              <img
                className="sender-avatar"
                src={notification?.sender?.pic}
                alt="useravatar"
                width={"100px"}
              />
            </Link>
          </div>
          <div className="notification-text-container">
            {(notification.notificationType === "like" ||
              notification.notificationType === "comment") && (
              <Link to={`/post/${notification.link}`}>
                <div className="notification-text">
                  {notification.notificationText}
                </div>
                <div className="notification-time">
                  {moment().diff(moment(notification.createdAt)) <
                  7 * 24 * 60 * 60 * 1000
                    ? moment(notification.createdAt).fromNow()
                    : moment(notification.createdAt).calendar()}
                </div>
              </Link>
            )}
            {notification.notificationType === "follow" && (
              <Link to={`/profile/${notification.link}`}>
                <div className="notification-text">
                  {notification.notificationText}
                </div>
                <div className="notification-time">
                  {moment().diff(moment(notification.createdAt)) <
                  7 * 24 * 60 * 60 * 1000
                    ? moment(notification.createdAt).fromNow()
                    : moment(notification.createdAt).calendar()}
                </div>
              </Link>
            )}
          </div>
          {notification.notificationType === "like" && (
            <div>
              <Link to={`/post/${notification.link}`}>
                <img
                  className="notification-media"
                  src={notification?.post[0]?.photo}
                  alt="media"
                  width={"100px"}
                />
              </Link>
            </div>
          )}
          {notification.notificationType == "follow" ? (
            notification.following ? (
              <button
                className="btn waves-effect waves-light #64b5f6 blue darken-2"
                type="submit"
                name="action"
                onClick={() => unfollowUser(notification.link)}
              >
                Unfollow
              </button>
            ) : (
              <button
                className="btn waves-effect waves-light #64b5f6 blue darken-2"
                type="submit"
                name="action"
                onClick={() => followUser(notification.link)}
              >
                Follow
              </button>
            )
          ) : (
            ""
          )}
          {notification.notificationType === "comment" && (
            <div>
              <Link to={`/post/${notification.link}`}>
                <img
                  className="notification-media"
                  src={notification?.post[0]?.photo}
                  alt="media"
                  width={"100px"}
                />
              </Link>
            </div>
          )}
        </div>
      )}
    </>
  );
};

Notifications.propTypes = {
  notification: propTypes.object.isRequired,
};
export default Notifications;
