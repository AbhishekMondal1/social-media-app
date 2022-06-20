import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from '../../App'
import Post from "../Post/Post"
import { Link } from 'react-router-dom'
import Stories from "./Stories";
import { authHeader } from '../../services/authHeaderConfig';
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalpage, setTotalPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const { state, dispatch } = useContext(UserContext) 

  useEffect(() => {
    axios.get("/auth/user", {
      withCredentials: 'true',
      headers: {
        "Content-Type": "application/json",
      }
    })
      .then(res => {
        if (res.data.error) {
          console.log("ERROR")
        } else {
          dispatch({ type: "USER", payload: res.data.user })
        }
      })
      .catch(err => {
        console.log("err", err);
      })
  }, [])

  useEffect(() => {
    setLoading(true)
    axios.get(`/allpost?page=${page}`, {
      withCredentials: 'true',
      headers: authHeader(),
    })
      .then(res => res.data)
      .then(({ postsdata, totalPages }) => {
        setData(postsdata)
        setTotalPage(totalPages)
        console.log(postsdata)
      })
    setLoading(false)
  }, [page])

  window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    let maxpage = 0
    if (page === 4) {
      maxpage = 1
    }
    if (page < totalpage && maxpage === 0) {
      if (scrollTop + clientHeight >= scrollHeight) {
        console.log('bottom');
        if (page <= totalpage) {
          setPage(page + 1)
          console.log('pages', page)
        }
        //setPage(prevPage => prevPage + 1)
        // console.log('page',page)
      }
    }
  })

  return (
    <div className="home">
      <Stories />
      {data.map((item) => {
        return (
          <Post item={item} setData={setData} data={data}/>          
        );
      })}
      {loading ? <h1>Loading...</h1> : ""}
    </div>
  );
}

export default Home;