import React, { useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from './components/screens/UserProfile'
import SubscribeUserPost from "./components/screens/SubscribeUserPost";
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword'
import UserPosts from "./components/screens/UserPosts";
import Comments from "./components/screens/Comments";
import Notification from "./components/screens/Notification";
// import Messenger from './components/temp/ScratchComponents/Messenger';
import ChatMessenger from "./components/screens/chatMessenger/ChatMessenger";
import EditProfile from "./components/screens/EditProfile";
//import UserPosts from './components/screens/UserPosts'
import { ChatContextProvider } from "./context/ChatContext/ChatContext";
import { UserContextProvider, UserContext } from "./context/UserContext/UserContext";
import { SocketContextProvider } from "./context/SocketContext/SocketContext";
import { NotificationContextProvider } from "./context/NotificationContext/NotificationContext";

const Routing = () => {
  const navigate = useNavigate()
  const { userState, userDispatch } = useContext(UserContext)

  useEffect(() => {
    console.log(userState)
    const user = JSON.parse(localStorage.getItem("user")) || null
    if (user) {
      userDispatch({ type: "USER", payload: user })    
      console.log(userState)

      // navigate('/')
    }// else {
    // if(!user && !navigate.location.pathname.startsWith('/reset'))
    //  navigate('/signin')

    /*if (!navigate.location.pathname.startsWith("/google"))
      navigate("/google");*/
    // }
  }, [])
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/editprofile" element={<EditProfile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/profile/:userid" element={<UserProfile />} />
      <Route path="/post/:postid" element={<UserPosts />} />
      <Route path="/myfollowingpost" element={<SubscribeUserPost />} />
      <Route path="/allcomments/:postid" element={<Comments />} />
      <Route path="/reset" element={<Reset />} />
      <Route path="/reset/:token" element={<NewPassword />} />
      <Route path="/notifications" element={<Notification />} />
      <Route path="/chatmessages" element={<ChatMessenger />} />
      <Route path="/chatmessages/:userid" element={<ChatMessenger />} />
    </Routes>
  );

}

function App() { 
  return (
    <UserContextProvider>
      <ChatContextProvider>
        <SocketContextProvider>
          <NotificationContextProvider>
            <BrowserRouter>
              <Navbar />
                <ToastContainer />
              <Routing />
            </BrowserRouter>
          </NotificationContextProvider>
        </SocketContextProvider>
      </ChatContextProvider>
    </UserContextProvider>
  );
}

export default App;
