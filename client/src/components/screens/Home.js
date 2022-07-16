import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from '../../context/UserContext/UserContext';
import Post from "../Post/Post";
import Stories from "./Stories";
import { authHeader } from '../../services/authHeaderConfig';
import axios from "axios";
import SkeletonPostLoader from "../SkeletonPostLoader/SkeletonPostLoader";

const Home = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [hasMorePages, setHasMorePages] = useState(true)
  const [loading, setLoading] = useState(true)
  const morepostRef = useRef()
  const { userState, userDispatch } = useContext(UserContext)

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
          localStorage.setItem("user", JSON.stringify(res.data.user));
          userDispatch({ type: "USER", payload: res.data.user })
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
      .then(({ hasMorePages, allposts }) => {
        setData([...data, ...allposts])
        setHasMorePages(hasMorePages)
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

  return (
    <div className="home">
      <Stories />
      {data && data.map((item) => {
        return (
          <Post item={item} setData={setData} data={data} />
        );
      })}
      {loading && <SkeletonPostLoader />}
      <div className="morepost"
        ref={morepostRef}
        style={{
          width: "10px", height: "50px",
          display: `${loading ? "none" : "block"}`
        }}>
      </div>
    </div>
  );
}

export default Home;