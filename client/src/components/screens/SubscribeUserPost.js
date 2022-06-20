import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";
import Post from "../Post/Post";

const SubscribeUserPost = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalpage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(true);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    setLoading(true)
    axios.get(`/getsubpost?page=${page}`, {
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then((result) => {
        setData(result.postsdata);
      });
    setLoading(false)
  }, [page]);

  window.addEventListener("scroll", () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log("bottom");
      setPage(page + 1);
      //setPage(prevPage => prevPage + 1)
      console.log(page);
    }
  });

  return (
    <div className="home">
      {data.map((item) => {
        return (
          <Post item={item} setData={setData} data={data} />
        );
      })}
       {loading ? <h1>Loading...</h1> : ""}
    </div>
  );
};

export default SubscribeUserPost;
