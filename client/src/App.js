import React, { useEffect, useContext } from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
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
import Messenger from './components/temp/ScratchComponents/Messenger';
import ChatMessenger from "./components/screens/chatMessenger/ChatMessenger";
import EditProfile from "./components/screens/EditProfile";
//import UserPosts from './components/screens/UserPosts'
import { ChatContextProvider } from "./context/ChatContext/ChatContext";
import { UserContextProvider, UserContext } from "./context/UserContext/UserContext";

const Routing = () => {
  const history = useHistory()
  const { userState, userDispatch } = useContext(UserContext)
  useEffect(() => {
    console.log(userState)
    const user = JSON.parse(localStorage.getItem("user")) || null
    if (user) {
      userDispatch({ type: "USER", payload: user })
      // history.push('/')
    }// else {
    // if(!user && !history.location.pathname.startsWith('/reset'))
    //  history.push('/signin')

    /*if (!history.location.pathname.startsWith("/google"))
      history.push("/google");*/
    // }
  }, [])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route exact path="/profile">
        <Profile />
      </Route>
      <Route path="/editprofile">
        <EditProfile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/post/:postid">
        <UserPosts />
      </Route>
      <Route exact path="/myfollowingpost">
        <SubscribeUserPost />
      </Route>
      <Route path="/allcomments/:postid">
        <Comments />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route exact path="/reset/:token">
        <NewPassword />
      </Route>
      <Route exact path="/messages">
        <Messenger />
      </Route>
      <Route exact path="/chatmessages">
        <ChatMessenger />
      </Route>
    </Switch>
  );

}

function App() {
  return (
    <UserContextProvider>
      <ChatContextProvider>
        <BrowserRouter>
          <Navbar />
          <Routing />
        </BrowserRouter>
      </ChatContextProvider>
    </UserContextProvider>
  );
}

export default App;
