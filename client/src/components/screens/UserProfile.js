import React, { useEffect, useState, useContext, useRef } from "react";
import { UserContext } from "../../context/UserContext/UserContext";
import { useParams, Link } from 'react-router-dom'
import { authHeader } from "../../services/authHeaderConfig";
import SkeletonPostGridLoader from "../SkeletonPostGridLoader/SkeletonPostGridLoader";
import axios from "axios";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState([])
  const { userState, userDispatch } = useContext(UserContext);
  const { userid } = useParams()
  const [showFollow, setShowFollow] = useState()

  const [postdata, setPostData] = useState([])
  const [page, setPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [loading, setLoading] = useState(true)
  const [totalNumberOfPosts, setTOtalNumberOfPosts] = useState(0)
  const morepostRef = useRef()

  useEffect(() => {
    axios.get(`/user/${userid}`, {
      withCredentials: true,
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then(result => {
        setUserProfile(result.user[0])
        setShowFollow(!result.user[0].follows)
      })
  }, []);

  useEffect(() => {
    setLoading(true)
    axios.get(`/userspostlist/${userid}?page=${page}`, {
      withCredentials: 'true',
      headers: authHeader(),
    })
      .then(res => res.data)
      .then(({ hasMorePages, postlists, totalNumberOfPosts }) => {
        setPostData([...postdata, ...postlists])
        setHasMorePages(hasMorePages)
        setTOtalNumberOfPosts(totalNumberOfPosts)
        setLoading(false)
      })
  }, [page])

  useEffect(() => {
    if (!morepostRef.current) return;
    const observer = new IntersectionObserver(
      (data) => {
        if (data[0].isIntersecting) {
          setPage(prevpage => prevpage + 1)
        }
      },
      {
        root: null,
        threshold: 0,
      })
    observer.observe(morepostRef.current)
    if (hasMorePages === false) {
      observer.unobserve(morepostRef.current)
    }
    return () => {
      if (morepostRef.current) {
        observer.unobserve(morepostRef.current)
      }
    }
  }, [morepostRef.current, hasMorePages])

  const followUser = () => {
    axios.put("/follow", {
      followId: userid
    }, {
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then((data) => {   
        setShowFollow(false)
        setShowFollow(!data.follows)
        setUserProfile(prev => ({
          ...prev,
          totalFollowers: prev.totalFollowers + 1,
        }))
        userDispatch({
          type: "UPDATE_FOLLOWING",
          payload: { totalFollowing: userState.totalFollowing + 1 }
        });
        const localStorageUser = JSON.parse(localStorage.getItem("user"))
        localStorageUser.totalFollowing = localStorageUser.totalFollowing + 1
        localStorage.setItem("user", JSON.stringify(localStorageUser))        
      })      
      .catch((err) => {
        console.log(err);
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

        setShowFollow(!data.follows)
        setUserProfile(prev => ({
          ...prev,
          totalFollowers: prev.totalFollowers - 1,
        }))
        userDispatch({
          type: "UPDATE_FOLLOWING",
          payload: { totalFollowing: userState.totalFollowing - 1 }
        });
        const localStorageUser = JSON.parse(localStorage.getItem("user"))
        localStorageUser.totalFollowing = localStorageUser.totalFollowing - 1
        localStorage.setItem("user", JSON.stringify(localStorageUser))
      })
      .catch((err) => {
        console.log(err);
      });
    };
    return (
      <>
      {userProfile && (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0px",
              borderBottom: "1px solid grey",
            }}
          >
            <div style={{height: "180px"}}>
              <img
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                  objectFit: "cover",
                }}
                src={userProfile.pic}
                alt="profile_picture"
              />
            </div>
            <div>
              <h4>{userProfile.name}</h4>
              <h5>{userProfile.username}</h5>
              <h5>{userProfile.bio}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{totalNumberOfPosts} posts</h6>
                <h6>{userProfile.totalFollowers} followers</h6>
                <h6>{userProfile.totalFollowing} following</h6>
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
                <Link to={`/chatmessages/${userProfile._id}`}>
                <button className="btn waves-effect waves-light #64b516 green darken-2">
                  Message
                </button>
                </Link>
              }
            </div>
          </div>
          <div className="gallary">
            {postdata.map((item) => {
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
      )}
      {loading && <SkeletonPostGridLoader />}
      <div className="morepost"
        ref={morepostRef}
        style={{
          width: "10px", height: "50px",
          display: `${loading ? "none" : "block"}`
        }}>
      </div>
    </>
  );
}

export default UserProfile;
