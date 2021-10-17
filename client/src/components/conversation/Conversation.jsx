import React, {useState, useEffect} from 'react'
import './conversation.css';
import axios from 'axios';

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  useEffect(() => {
    // get friends userid from conversation
    const friendId = conversation.members.find((m) => m !== currentUser._id);
    // fetch users data and set profile picture and others
    const getUser = async () => {
      try {
        const res = await axios("/user/" + friendId,
          { headers: { "Authorization": "Bearer " + localStorage.getItem("jwt") } });
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

    return (
      <div className="conversation-item">
        <img
          src={user?.user.pic ? user.user.pic : PF+"profiles/avatar.png"}
          alt=""
          className="conversation-img"
        />
        <span className="conversation-name">{ user?.user.name }</span>
      </div>
    );
}

export default Conversation;