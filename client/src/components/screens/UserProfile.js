import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import {useParams} from 'react-router-dom'
const Profile = () => {
  const [userProfile, setProfile] = useState([])
  const [userProfileName, setProfileName] = useState([])
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams()
  console.log(userProfileName);
  useEffect(() => {
    fetch(`/user/${userid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then(result => {
        console.log(result.user);
        setProfile(result.posts)
        setProfileName(result.user)
      })
  }, []);
  return (
    <>
      {(userProfile && userProfileName) ? (
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
                src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
              />
            </div>
            <div>
              <h4>{userProfileName.name}</h4>
              <h5>{userProfileName.email}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.length} posts</h6>
                <h6>50 followers</h6>
                <h6>50 folllowing</h6>
              </div>
            </div>
          </div>
          <div className="gallary">
            {userProfile.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              );
            })}
          </div>
        </div >
      ) : (
          <h2>Loading...</h2>
        )}
    </>
  );
}

export default Profile;
