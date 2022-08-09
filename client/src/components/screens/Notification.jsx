import React, { useContext, useEffect, useState } from "react";
import { NotificationContext } from "../../context/NotificationContext/NotificationContext";
import Notifications from "../Notifications/Notifications";
import axios from "axios";
import { authHeader } from "../../services/authHeaderConfig";
import InfiniteScroll from "react-super-infinite-scroller";

const Notification = () => {
  const { notificationState, notificationDispatch } =
    useContext(NotificationContext);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const abortController = new AbortController();
    const getNotifications = async () => {
      const res = await axios.get(`/notifications?page=${page}`, {
        headers: authHeader(),
        signal: abortController.signal,
      });      
      notificationDispatch({
        type: "ADD_NOTIFICATIONS",
        payload: {
          notifications: res.data.notifications,
        },
      });
      setHasMorePages(res.data.hasMorePages);
      setLoading(false);
    };
    getNotifications();
    return () => {
      abortController.abort();
    };
  }, [page]);

  return (
    <div className="notification-page">
      <div className="notifications-container">
        <InfiniteScroll
          setPage={setPage}
          hasMorePages={hasMorePages}
          loading={loading}
        >
          {notificationState.notifications.length > 0 &&
            notificationState.notifications.map((n) => {
              if (n != null) {
                return <Notifications notification={n} />;
              }
            })}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Notification;
