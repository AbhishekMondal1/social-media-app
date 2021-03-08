import React, {useEffect,createContext, useReducer, useContext} from "react";
import Navbar from "./components/Navbar";
import "./App.css";
import { BrowserRouter, Route, Switch,useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import AdminSignup from "./components/screens/AdminSignup";
import CreatePost from "./components/screens/CreatePost";
import {reducer,initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import SubscribeUserPost from "./components/screens/SubscribeUserPost";
import Reset from './components/screens/Reset';
import NewPassword from './components/screens/NewPassword'
import UserPosts from "./components/screens/UserPosts";
import Comments from "./components/screens/Comments";
import Messenger from './components/Messenger';
//import UserPosts from './components/screens/UserPosts'
export const UserContext = createContext()
const Routing = () => {
  const history = useHistory()
  const {state,dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      dispatch({type:"USER",payload:user})
      history.push('/')
    }// else {
      if(!user && !history.location.pathname.startsWith('/reset'))
       history.push('/signin')
    
      /*if (!history.location.pathname.startsWith("/google"))
        history.push("/google");*/
   // }
  },[])
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/admin-signup">
        <AdminSignup />
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
    </Switch>
  );

}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
