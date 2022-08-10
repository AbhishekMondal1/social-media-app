import React, { useState, useEffect } from "react";
import propTypes from "prop-types";
import "./conversation.css";
import axios from "axios";

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    // get friends userid from conversation
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    // fetch users data and set profile picture and others
    const getUser = async () => {
      try {
        const res = await axios("/user/" + friendId, {
          headers: { Authorization: "Bearer " + localStorage.getItem("jwt") },
        });
        setUser(res.data.user[0]);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation-item">
      <img
        src={user?.pic ? user.pic : PF + "profiles/avatar.png"}
        alt=""
        className="conversation-img"
      />
      <span className="conversation-name">{user?.name}</span>
    </div>
  );
};

Conversation.propTypes = {
  conversation: propTypes.object.isRequired,
  currentUser: propTypes.object.isRequired,
};

export default Conversation;
