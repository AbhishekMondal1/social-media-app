import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import './chatMessenger.css';
import Conversation from '../../conversation/Conversation';
import Message from '../../messages/Message';
import ChatOnline from '../../chatOnline/ChatOnline';
import { io } from "socket.io-client";
import { authHeader } from '../../../services/authHeaderConfig';
import { ChatContext } from '../../../context/ChatContext/ChatContext';
import { UserContext } from '../../../context/UserContext/UserContext';

const ChatMessenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const socket = useRef();
  const scrollRef = useRef();
  const { userState, userDispatch } = useContext(UserContext);
  const { chatState, chatDispatch } = useContext(ChatContext);
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // establish Socket connection
  useEffect(() => {
    const token = localStorage.getItem('jwt');
    socket.current = io("ws://localhost:9010", {
       query: { token },
       autoConnect: false,      
      });
      socket.current.connect();
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // Get Online users userId list
  useEffect(() => {
    socket.current.emit("addUser", userState?._id);
    socket.current.on("getUsers", (onlineUsersIds) => {
      chatDispatch({
        type: "SET_ONLINE_USERS",
        payload: {
          onlineUsersIds: onlineUsersIds,
        }
      });
    });

    socket.current.on("followerConnected", userId => {
      chatDispatch({
        type: "ADD_ONLINE_USER",
        payload: {
          userId: userId,
        }
      });
    })
    
    socket.current.on("followerDisconnected", async (userId) => {
      chatDispatch({
        type: "REMOVE_ONLINE_USER",
        payload: {
          userId: userId[0],
        }
      });
    })
  }, [userState]);

  useEffect(() => {
    socket.current?.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);

  // Fetch all previous messages
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversation/" + userState._id,
          { headers: authHeader(), });
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userState]);

  // get current conversation msg  
  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log(currentChat);
        const res = await axios.get("/messages/" + currentChat?._id,
          {
            headers: authHeader(),
          });
        console.log(res.data);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // send message 
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userState._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== userState._id
    );

    socket.current.emit("sendMessage", {
      senderId: userState._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post("/messages", message,
        {
          headers: authHeader(),
        }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // smooth scroll effect
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <>
      <div className="messenger">
        <div className="conversation-menu">
          <div className="conversation-container">
            <input
              placeholder="Search for friends"
              className="chat-menu-input"
            />
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={userState} />
              </div>
            ))}
          </div>
        </div>
        <div className="chat-box">
          <div className="chat-box-container">
            {currentChat ? (
              <>
                <div className="chat-box-top">
                  {messages.map((m) => (
                    <div ref={scrollRef}>
                      <Message message={m} own={m.sender === userState._id} />
                    </div>
                  ))}
                </div>
                <div className="chat-box-bottom">
                  <textarea
                    className="chat-message-input"
                    placeholder="write something..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chat-submit-button" onClick={handleSubmit}>
                    Send
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Open a conversation to start a chat.
              </span>
            )}
          </div>
        </div>
        <div className="chat-online">
          <div className="chat-online-container">
            <ChatOnline
              onlineUsers={chatState.usersOnline}
              currentId={userState?._id}
              setCurrentChat={setCurrentChat}
              newMessage={newMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatMessenger;
