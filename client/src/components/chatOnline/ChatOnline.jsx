import React, { useState, useEffect } from "react";
import axios from "axios";
import "./chatOnline.css";

const ChatOnline = ({ onlineUsers, currentId, setCurrentChat, newMessage }) => {
  const [followings, setFollowings] = useState([]);
  const [onlineFollowings, setOnlineFollowings] = useState([]);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  // fetch all followings
  useEffect(() => {
    const getFollowings = async () => {
      const res = await axios.get("/followings/" + currentId);
      setFollowings(res.data);
      console.log("fowngs", res.data);
    };
    getFollowings();
  }, [currentId]);

  // get online followings
  useEffect(() => {
    setOnlineFollowings(followings.filter((f) => onlineUsers.includes(f._id)));
    console.log(onlineUsers);
  }, [followings, onlineUsers]);

  const handleClick = async (user) => {
    try {
      const res = await axios.get(
        `conversation/find/${currentId}/${user._id}`
      );
      setCurrentChat(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="chat-online">
      {onlineFollowings.map((o) => (
        <div
          className="chat-online-friend"
          onClick={() => {
            handleClick(o);
          }}
        >
          <div className="chat-online-img-container">
            <img
              className="chat-online-img"
              src={o?.pic ? o.rofilePicture : PF + "/api/profiles/avatar.png"}
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

export default ChatOnline;
