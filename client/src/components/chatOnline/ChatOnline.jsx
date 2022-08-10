import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chatOnline.css";
import { authHeader } from "../../services/authHeaderConfig";
import propTypes from "prop-types";

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat, newMessage }) => {
  const [onlineFollowings, setOnlineFollowings] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  console.log(newMessage);

  useEffect(() => {
    const getOnlineFollowingsUsers = async () => {
      const res = await axios.post(
        "/onlinefollowingusers",
        { onlineUsers },
        { headers: authHeader() },
      );
      setOnlineFollowings(() => [...res.data]);
    };
    if (Array.isArray(onlineUsers)) {
      if (onlineUsers.length > 0) {
        getOnlineFollowingsUsers();
      }
      if (onlineUsers.length === 0) {
        setOnlineFollowings([]);
      }
    }
  }, [onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `conversation/find/${currentId}/${user._id}`,
        { headers: authHeader() },
      );
      if (res.data == null) {
        const res = await axios.post(
          `conversation/`,
          {
            senderId: currentId,
            receiverId: user._id,
          },
          { headers: authHeader() },
        );
        setCurrentChat(res.data);
      } else {
        setCurrentChat(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chat-online">
      {onlineFollowings.length > 0 &&
        onlineFollowings.map((o) => (
          <div
            className="chat-online-friend"
            key={o._id}
            onClick={() => {
              handleClick(o);
            }}
          >
            <div className="chat-online-img-container">
              <img
                className="chat-online-img"
                src={o?.pic ? o.pic : PF + "/api/profiles/avatar.png"}
                alt=""
              />
              <div className="chat-online-badge"></div>
            </div>
            <span className="chat-online-name">{o.name}</span>
          </div>
        ))}
    </div>
  );
};

ChatOnline.propTypes = {
  onlineUsers: propTypes.array,
  currentId: propTypes.string,
  setCurrentChat: propTypes.func,
  newMessage: propTypes.string,
};

export default ChatOnline;
