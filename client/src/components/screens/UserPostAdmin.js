import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
const UserPostAdmin = () => {
  const [data, setData] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { postid } = useParams();

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

  const reportPost = (postid) => {
   fetch(`/report/${postid}`, {
     method: "put",
     headers: {
       "Content-Type": "application/json",
       Authorization: "Bearer " + localStorage.getItem("jwt"),
     },
   })
     .then((res) => res.json())
     .then((result) => {
       const newData = data.map((item) => {
         if (item._id === result._id) {
           return result;
         } else {
           return item;
         }
       });
       //console.log(newData)
       setData(newData);
     })
     .catch((err) => {
       console.log(err);
     });
}

  return (
    <>
      {data._id === undefined ? (
        <div class="lds-heart">
          <div></div>
        </div>
      ) : (
        <div className="card home-card" key={data._id}>
          <h5 style={{ padding: "5px" }}>
            <Link to={"/profile/" + data.postedBy._id}>
              <div className="avatar">
                <img
                  src={data.postedBy.pic}
                  alt=""
                  className="circle"
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "16px",
                    marginLeft: "5px",
                  }}
                />
                <span>{data.postedBy.name}</span>
              </div>
            </Link>

            {(
              <i
                className="material-icons"
                style={{
                  float: "right",
                }}
                onClick={() => deletePost(data._id)}
              >
                delete
              </i>
            )}
          </h5>
          <h5>
            <Link to={"/profile/" + data.postedBy._id}>
              {data.postedBy.username}
            </Link>
          </h5>
          <div className="card-image">
            <img src={data.photo} alt="" />
          </div>
          <div className="card-content">
           
            <h6>{data.likesCount} likes</h6>
            <h6>{data.title}</h6>
            <p>
              <span>{data.postedBy.name}</span>
              &nbsp;{data.body}
            </p>
            {data.comments.slice(0, 2).map((record) => {
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
            <Link to={"/allcomments/" + data._id}>
              <p>view all {data.comments.length} comments</p>
            </Link>
              <h6>
                {moment().diff(moment(data.createdAt)) < 7 * 24 * 60 * 60 * 1000
                  ? moment(data.createdAt).fromNow()
                  : moment(data.createdAt).calendar()}
              </h6>
          </div>
        </div>
      )}{" "}
    </>
  );
};

export default UserPostAdmin;
