import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext/UserContext";
import { useParams, Link } from "react-router-dom";
import moment from "moment";

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [data, setData] = useState([]);
  const [postData, setPotsData] = useState([]);
  const { userState, userDispatch } = useContext(UserContext);
  const { postid } = useParams();
  useEffect(() => {
    fetch("/totalusers", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setTotalUsers(result);
        console.log(result);
      });
  }, [totalUsers]);

  useEffect(() => {
    fetch(`/post/${postid}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(moment().startOf("hour").fromNow())
        console.log(result.mypost);
        setData(result.mypost);
        console.log(data._id);
      });
  }, []);

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json)
      .then((result) => {
        console.log("res");
        console.log(result._id);
        const newData = data.filter((item) => {
          console.log(item._id);
          return item._id !== result._id;
        });
        console.log("newd");
        console.log(newData);
        setData(newData);
      });
  };

  return (
    <>
      <h6>{totalUsers} </h6>
      <h5>totalUsers </h5>(
      <>
        {postData._id === undefined ? (
          <div className="lds-heart">
            <div></div>
          </div>
        ) : (
          <div className="card home-card" key={postData._id}>
            <h5 style={{ padding: "5px" }}>
              <Link to={"/profile/" + postData.postedBy._id}>
                <div className="avatar">
                  <img
                    src={postData.postedBy.pic}
                    alt=""
                    className="circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "16px",
                      marginLeft: "5px",
                    }}
                  />
                  <span>{postData.postedBy.name}</span>
                </div>
              </Link>

              {
                <i
                  className="material-icons"
                  style={{
                    float: "right",
                  }}
                  onClick={() => deletePost(postData._id)}
                >
                  delete
                </i>
              }
            </h5>
            <h5>
              <Link to={"/profile/" + postData.postedBy._id}>
                {postData.postedBy.username}
              </Link>
            </h5>
            <div className="card-image">
              <img src={postData.photo} alt="" />
            </div>
            <div className="card-content">
              <h6>{postData.likesCount} likes</h6>
              <h6>{postData.title}</h6>
              <p>
                <span>{postData.postedBy.name}</span>
                &nbsp;{postData.body}
              </p>
              {postData.comments.slice(0, 2).map((record) => {
                return (
                  <h6 key={record._id}>
                    <span style={{ fontWeight: "500" }}>
                      {record.postedBy.name}
                    </span>
                    {record.text}
                    <h6>
                      <span>
                        {moment().diff(moment(record.createdAt)) <
                        7 * 24 * 60 * 60 * 1000
                          ? moment(record.createdAt).fromNow()
                          : moment(record.createdAt).calendar()}
                      </span>
                    </h6>
                  </h6>
                );
              })}
              <Link to={"/allcomments/" + postData._id}>
                <p>view all {postData.comments.length} comments</p>
              </Link>
              <h6>
                {moment().diff(moment(postData.createdAt)) <
                7 * 24 * 60 * 60 * 1000
                  ? moment(postData.createdAt).fromNow()
                  : moment(postData.createdAt).calendar()}
              </h6>
            </div>
          </div>
        )}
      </>
      );
    </>
  );
};

export default AdminDashboard;
