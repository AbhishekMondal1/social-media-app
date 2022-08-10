import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./chatMessenger.css";
import Conversation from "../../conversation/Conversation";
import Message from "../../messages/Message";
import ChatOnline from "../../chatOnline/ChatOnline";
import InfiniteScroll from "react-super-infinite-scroller";
import { authHeader } from "../../../services/authHeaderConfig";
import { ChatContext } from "../../../context/ChatContext/ChatContext";
import { UserContext } from "../../../context/UserContext/UserContext";
import { SocketContext } from "../../../context/SocketContext/SocketContext";

const ChatMessenger = () => {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const { userid } = useParams();
  const scrollRef = useRef();
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [chatUser, setChatUser] = useState(null);

  const { userState } = useContext(UserContext);
  const { chatState, chatDispatch } = useContext(ChatContext);
  const { socketState } = useContext(SocketContext);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [arrivalMessage, ...prev]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    setMessages([]);
    setNewMessage("");
    setPage(1);
    setArrivalMessage(null);
  }, [currentChat]);

  useEffect(() => {
    socketState.chatSocket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  // Get Online users userId list
  useEffect(() => {
    socketState.chatSocket.emit("addUser", userState?._id);
    socketState.chatSocket.on("getUsers", (onlineUsersIds) => {
      chatDispatch({
        type: "SET_ONLINE_USERS",
        payload: {
          onlineUsersIds: onlineUsersIds,
        },
      });
    });

    socketState.chatSocket.on("followerConnected", (userId) => {
      chatDispatch({
        type: "ADD_ONLINE_USER",
        payload: {
          userId: userId,
        },
      });
    });

    socketState.chatSocket.on("followerDisconnected", async (userId) => {
      chatDispatch({
        type: "REMOVE_ONLINE_USER",
        payload: {
          userId: userId[0],
        },
      });
    });
  }, [userState]);

  useEffect(() => {
    socketState.chatSocket?.on("welcome", (message) => {
      console.log(message);
    });
  }, [socketState]);

  // create new conversation
  useEffect(() => {
    const createConversation = async () => {
      try {
        const res = await axios.post(
          "/conversation",
          {
            senderId: userState._id,
            receiverId: chatUser,
          },
          { headers: authHeader() },
        );
        setCurrentChat(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if (userid) {
      setChatUser(userid);
    }
    if (chatUser) {
      createConversation();
    }
  }, [chatUser]);

  // Fetch all previous messages
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("/conversation/" + userState._id, {
          headers: authHeader(),
        });
        setConversations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userState, chatUser]);

  // get current conversation msg
  useEffect(() => {
    setLoading(true);
    const getMessages = async () => {
      try {
        const res = await axios.get(
          `/messages/${currentChat._id}?page=${page}`,
          {
            headers: authHeader(),
          },
        );
        setMessages((prev) => [...prev, ...res.data.messages]);
        setHasMorePages(res.data.hasMorePages);

        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, page]);

  // send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: userState._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== userState._id,
    );

    socketState.chatSocket.emit("sendMessage", {
      senderId: userState._id,
      receiverId,
      text: newMessage,
    });
    try {
      const res = await axios.post("/messages", message, {
        headers: authHeader(),
      });
      setMessages([res.data, ...messages]);
      setNewMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  // smooth scroll effect
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [newMessage, arrivalMessage]);

  return (
    <>
      <div className="messenger">
        <div className="conversation-menu">
          <div className="conversation-container">
            <input
              placeholder="Search for friends"
              className="chat-menu-input"
            />
            {conversations.map((c, i) => (
              <div onClick={() => setCurrentChat(c)} key={i}>
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
                  <InfiniteScroll
                    setPage={setPage}
                    loading={loading}
                    hasMorePages={hasMorePages}
                    reverse={true}
                  >
                    {messages
                      .map((m, i) => (
                        <div ref={scrollRef} key={i}>
                          <Message
                            message={m}
                            own={m.sender[0]?._id == userState._id}
                          />
                        </div>
                      ))
                      .reverse()}
                  </InfiniteScroll>
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
              // newMessage={newMessage}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessenger;
