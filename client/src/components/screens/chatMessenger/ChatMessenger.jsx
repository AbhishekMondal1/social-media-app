import React, { useState, useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import './chatMessenger.css';
import Conversation from '../../conversation/Conversation';
import Message from '../../messages/Message';
import ChatOnline from '../../chatOnline/ChatOnline';
import { UserContext } from '../../../App';
import { io } from "socket.io-client";

const ChatMessenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const socket = useRef();
  const { state, dispatch } = useContext(UserContext);
  const scrollRef = useRef();
  console.log(state)
  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  // establish Socket connection
  useEffect(() => {
    socket.current = io("ws://localhost:9010");
    socket.current.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // Get Online users list
  useEffect(() => {
    socket.current.emit("addUser", state?._id);
    socket.current.on("getUsers", (users) => {
      setOnlineUsers(
        state?.following.filter((f) => users.some((u) => u.userId === f))
      );
    });
    console.log(onlineUsers);
  }, [state, newMessage]);

  useEffect(() => {
    socket.current?.on("welcome", (message) => {
      console.log(message);
    });
  }, [socket]);

  // Fetch all previous messages
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversation/" + state._id);
        setConversations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [state]);

  // get current conversation msg

  useEffect(() => {
    const getMessages = async () => {
      try {
        console.log(currentChat);
        const res = await axios.get("/messages/" + currentChat?._id);
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
      sender: state._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== state._id
    );
    socket.current.emit("sendMessage", {
      senderId: state._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post("/messages", message);
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
                <Conversation conversation={c} currentUser={state} />
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
                      <Message message={m} own={m.sender === state._id} />
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
              onlineUsers={onlineUsers}
              currentId={state?._id}
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
