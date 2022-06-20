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
  const [data, setData] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const { postid } = useParams()

  useEffect(() => {
    axios.get(`/post/${postid}`, {
      headers: authHeader(),
    }).then(res => res.data)
      .then(result => {
        setData(result.allpostdata)
      })
  }, []);

  return (
    <>
      {data._id === undefined ? (
        <div class="lds-heart">
          <div></div>
        </div>
      ) : (
        <div className="individualpost-wrapper">
          <div className="individualpost-left">
            <Post item={data} individualpost={true} setData={setData} data={data} />
          </div>
          <div className="individualpost-right">
            <Comments setData={setData} data={data} />
          </div>
        </div>
      )}
    </>
  );
}

export default UserPosts;