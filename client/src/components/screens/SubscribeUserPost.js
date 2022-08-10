import React, { useState, useEffect, useRef } from "react";
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";
import Post from "../Post/Post";
import SkeletonPostLoader from "../SkeletonPostLoader/SkeletonPostLoader";

const SubscribeUserPost = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loading, setLoading] = useState(true);
  const morepostRef = useRef();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`/getsubpost?page=${page}`, {
        headers: authHeader(),
      })
      .then((res) => res.data)
      .then(({ allFollowingPosts, hasMorePages }) => {
        setData([...data, ...allFollowingPosts]);
        setHasMorePages(hasMorePages);
        setLoading(false);
      });
  }, [page]);

  useEffect(() => {
    if (!morepostRef.current) return;
    const observer = new IntersectionObserver(
      (data) => {
        if (data[0].isIntersecting) {
          setPage((prevpage) => prevpage + 1);
        }
      },
      {
        root: null,
        threshold: 0,
      },
    );
    observer.observe(morepostRef.current);
    if (hasMorePages === false) {
      observer.unobserve(morepostRef.current);
    }
    return () => {
      if (morepostRef.current) {
        observer.unobserve(morepostRef.current);
      }
    };
  }, [morepostRef.current, hasMorePages]);

  return (
    <div className="home">
      {data.map((item, i) => {
        return <Post item={item} setData={setData} data={data} key={i} />;
      })}
      {loading && <SkeletonPostLoader />}
      <div
        className="morepost"
        ref={morepostRef}
        style={{
          width: "10px",
          height: "50px",
          display: `${loading ? "none" : "block"}`,
        }}
      ></div>
    </div>
  );
};

export default SubscribeUserPost;
