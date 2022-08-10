import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext/UserContext";
import Post from "../Post/Post";
// import Stories from "./Stories";
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";
import InfiniteScroll from "react-super-infinite-scroller";
import SkeletonPostLoader from "../SkeletonPostLoader/SkeletonPostLoader";

const Home = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [loading, setLoading] = useState(true);
  const { userDispatch } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("/auth/user", {
        withCredentials: "true",
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        if (res.data.error) {
          console.log("ERROR");
        } else {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          userDispatch({ type: "USER", payload: res.data.user });
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/allpost?page=${page}`, {
        withCredentials: "true",
        headers: authHeader(),
      })
      .then((res) => res.data)
      .then(({ hasMorePages, allposts }) => {
        setData([...data, ...allposts]);
        setHasMorePages(hasMorePages);
        setLoading(false);
      });
  }, [page]);

  return (
    <div className="home">
      <InfiniteScroll
        setPage={setPage}
        hasMorePages={hasMorePages}
        loading={loading}
      >
        {data &&
          data.map((item, i) => {
            return <Post item={item} setData={setData} data={data} key={i} />;
          })}
      </InfiniteScroll>
      {loading && <SkeletonPostLoader />}
    </div>
  );
};

export default Home;
