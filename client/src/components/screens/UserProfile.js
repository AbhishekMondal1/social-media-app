import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import { useParams, Link } from 'react-router-dom'
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";

const Profile = () => {
  const [userProfile, setProfile] = useState([])
  const [userProfileName, setProfileName] = useState([])
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams()
  const [showFollow, setShowFollow] = useState() //state?!state.following.includes(userid):true)
  //console.log(userProfileName);
  useEffect(() => {
    axios.get(`/user/${userid}`, {
      withCredentials: true,
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then(result => {
        setProfile(result.posts)
        setProfileName(result.user)
      })
      console.log(state)
  }, [userProfileName, userid]);
  //[userProfile]);

  const followUser = () => {
    axios.put("/follow", {
      followId: userid
    }, {
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then((data) => {
        console.log("data loggedin user", data); // logged in user data
        console.log("userprofilenm", userProfileName); // opened profile 
        // }) //
        // } //

        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following }
        });
        // localStorage.setItem("user", JSON.stringify(data)); 


        setProfileName((prevState) => {
          console.log("prevst", prevState);
          return {
            ...prevState,
            /* user: {
               ...prevState.user,
               followers: [...prevState.user.followers, data._id],
             },*/
          };
        });
        setShowFollow(false)
      })

      .catch((err) => {
        console.log("l", err);
      });
  }


  const unfollowUser = () => {
    axios.put("/unfollow", {
      unfollowId: userid,
    }, {
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then((data) => {
        console.log("data loggedin user", data); // logged in user data
        console.log("userprofilenm", userProfileName); // opened profile

        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, following: data.following },
        });
        // localStorage.setItem("user", JSON.stringify(data));

        setProfileName((prevState) => {
          console.log("prevst", prevState);
          return {
            ...prevState,
            /* user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },*/
          };
        });
        setShowFollow(true);
      })
      .catch((err) => {
        console.log("l", err);
      });
  };
  return (
    <>
      {userProfile && userProfileName ? (
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
                }}
                src={userProfileName.pic}
                alt="profile_picture"
              />
            </div>
            <div>
              <h4>{userProfileName.name}</h4>
              <h5>{userProfileName.username}</h5>
              <h5>{userProfileName.bio}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.length} posts</h6>
                <h6>{userProfileName.followers?.length} followers</h6>
                <h6>{userProfileName.following?.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-2"
                  type="submit"
                  name="action"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light #64b5f6 blue darken-2"
                  type="submit"
                  name="action"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
              {
                <button className="btn waves-effect waves-light #64b516 green darken-2">
                  Message
                </button>
              }
            </div>
          </div>
          <div className="gallary">
            {userProfile.map((item) => {
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
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
}

export default Profile;
