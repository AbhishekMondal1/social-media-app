import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import {Link,useParams} from 'react-router-dom'
import { UserContext } from '../../context/UserContext/UserContext'
import { authHeader } from "../../services/authHeaderConfig";
import settingsicon from "../icons/settings.svg";

const Profile = () => {
  const [mypics, setPics] = useState([])
  const { userState, dispatch } = useContext(UserContext)
  const { postid } = useParams();

  useEffect(() => {
    axios.get('/post', {
      headers: authHeader(),
    }).then(res => res.data)
      .then(result => {
        setPics(result.postsdata)
    })
    console.log(userState)
  }, [])
  
   return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              objectFit: "cover",
            }}
            src={userState ? userState.pic : "loading"}
          />
        </div>
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4
              className="pname"
              style={{ textDecoration: "uppercase", fontSize: "30px" }}
            >
              {userState ? userState.name : "loading"}
            </h4>
            <Link to="/editprofile" className="linksettings">
              <img src={settingsicon} />
            </Link>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6 className="">{mypics ? mypics.length : "0"} posts</h6>
            <h6 className="">
              {userState ? userState.totalFollowers : "0"} followers
            </h6>
            <h6 className="">
              {userState ? userState.totalFollowing : "0"} folllowing
            </h6>
          </div>
          <h4 className="usrname">{userState ? userState.username : "loading"}</h4>
          <h5 className="ubio">{userState ? userState.bio : "loading"}</h5>
        </div>
      </div>     
      <div className="gallary">
        {mypics.map((item) => {
          return (
            <>
              <Link to={"/post/" + item._id}>
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              </Link>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;