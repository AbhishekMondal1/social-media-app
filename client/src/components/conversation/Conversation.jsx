import React from 'react'
import './conversation.css';
import axios from 'axios';

const Conversation = () => {
    return (
      <div className="conversation-item">
        <img
          src={`https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg`}
          alt=""
          className="conversation-img"
        />
        <span className="conversation-name">Abhishek</span>
      </div>
    );
}

export default Conversation;