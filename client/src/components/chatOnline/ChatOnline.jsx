import React, { } from 'react';
import './chatOnline.css';

const ChatOnline = () => {
    return (
      <div className="chat-online">
        <div className="chat-online-friend">
          <div className="chat-online-img-container">
            <img
              className="chat-online-img"
              src={`https://image.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg`}
              alt=""
            />
            <div className="chat-online-badge"></div>
          </div>
          <span className="chat-online-name">Rohit Sharma</span>
        </div>
      </div>
    );
}


export default ChatOnline;