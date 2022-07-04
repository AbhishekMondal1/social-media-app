import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";
import "./userposts.css";
import Post from "../Post/Post";
import Comments from "./Comments";

const UserPosts = () => {
  const [singlePostData, setSinglePostData] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const { postid } = useParams()

  useEffect(() => {
    axios.get(`/post/${postid}`, {
      headers: authHeader(),
    }).then(res => res.data)
      .then(result => {
        setSinglePostData(result.singlepost[0])
      })
  }, []);

  return (
    <>
      {singlePostData._id === undefined ? (
        <div class="lds-heart">
          <div></div>
        </div>
      ) : (
        <div className="individualpost-wrapper">
          <div className="individualpost-left">
            <Post item={singlePostData} individualpost={true} setSinglePostData={setSinglePostData} singlePostData={singlePostData} />
          </div>
          <div className="individualpost-right">
            <Comments setSinglePostData={setSinglePostData} singlePostData={singlePostData} />
          </div>
        </div>
      )}
    </>
  );
}

export default UserPosts;