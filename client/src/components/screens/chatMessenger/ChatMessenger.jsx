import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import './chatMessenger.css';
import Conversation from '../../conversation/Conversation';
import Message from '../../messages/Message';
import ChatOnline from '../../chatOnline/ChatOnline';

 const ChatMessenger = () => {
return (
  <>
    <div className="messenger">
      <div className="conversation-menu">
        <div className="conversation-container">
          <input placeholder="Search for friends" className="chat-menu-input" />
          <Conversation />
        </div>
      </div>
      <div className="chat-box">
        <div className="chat-box-container">
          <div className="chat-box-top">
            <Message />
            <Message />
            <Message />
            <Message />
            <Message />
          </div>
          <div className="chat-box-bottom">
            <textarea
              className="chat-message-input"
              placeholder="write something..."
            ></textarea>
            <button className="chat-submit-button">
              Send
            </button>
          </div>
        </div>
      </div>
      <div className="chat-online">
        <div className="chat-online-container">
          <ChatOnline/>
        </div>
      </div>
    </div>
  </>
);
}

export default ChatMessenger;
