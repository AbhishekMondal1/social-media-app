import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
const UserPosts = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    const { postid } = useParams()    

    useEffect(() => {
        fetch(`/mypost/${postid}`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => { 
                //console.log(moment().startOf("hour").fromNow())
                console.log(result.mypost)
              setData(result.mypost)
              console.log(data._id)
            })
    }, []);

  const likepost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log(newData);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const unlikepost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        //console.log(result)
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        console.log(newData);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
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
  };

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
      // error USERNAME DATA.ID
  return (
    <>{data._id === undefined ? "Loading" : 
      <div className="card home-card" key={data._id}>
        <h5 style={{ padding: "5px" }}>
          <Link to={"/profile/" + data.postedBy._id}>
            {data.postedBy.name}
          </Link>

          {data.postedBy._id === state._id && (
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
          <i className="material-icons">favorite</i>
          {data.likes.includes(state._id) ? (
            <i className="material-icons" onClick={() => unlikepost(data._id)}>
              thumb_down
            </i>
          ) : (
              <i className="material-icons" onClick={() => likepost(data._id)}>
                thumb_up
              </i>
            )}
          <h6>{data.likes.length} likes</h6>
          <h6>{data.title}</h6>
          <p>{data.body}</p>
          {data.comments.map((record) => {
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
          <form
            onSubmit={(e) => {
              e.preventDefault();
              makeComment(e.target[0].value, data._id);
            }}
          >
            <input type="text" placeholder="add a comment" />
            <h6>
              {moment().diff(moment(data.createdAt)) < 7 * 24 * 60 * 60 * 1000
                ? moment(data.createdAt).fromNow()
                : moment(data.createdAt).calendar()}
            </h6>
          </form>
        </div>
      </div>
    } </>
    );
}

export default UserPosts;