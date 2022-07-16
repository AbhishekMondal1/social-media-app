import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../context/UserContext/UserContext";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import moment from "moment";
import { authHeader } from "../../services/authHeaderConfig";
import "./comments.css";
import send from "../icons/plane.svg";
import addmore from "../icons/addplus.svg";

import axios from "axios";

const Comments = ({ setData, data }) => {
  const [commentsdata, setCommentsData] = useState([]);
  const [page, setPage] = useState(1);
  const [newpage, setnewPage] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [comment, setComment] = useState("")
  const { userState, userDispatch } = useContext(UserContext);
  const { postid } = useParams();

  useEffect(() => {
    axios.get(`/allcomments/${postid}?page=${page}&newpage=${newpage}`, {
      headers: authHeader(),
    })
      .then((res) => res.data)
      .then((result) => {
        setCommentsData(result.comments[0]);
        setnewPage(false)
      });
  }, [page, newpage]);

  const makeComment = async (text, postId) => {
    setFetching(true)
    axios.put('/comment', {
      text,
      postId
    },
      {
        headers: authHeader(),
      })
      .then(res => res.data)
      .then(result => {
        const commentsState = []
        commentsState.push(commentsdata)
        const newComments = [result.c[0]].concat(commentsState[0].comments)
        commentsState[0].comments = newComments.slice(0)
        setFetching(false)
        setCommentsData(commentsState[0])
      })
      .catch(err => {
        console.log(err)
      })
  }

  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: authHeader(),
    })
      .then((res) => res.json)
      .then((result) => {
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

  const pageChange = () => {
    setPage(page + 1)
  }
  return (
    <>
      {commentsdata?._id === "undefined" ? (
        <div class="lds-heart">
          <div></div>
        </div>
      ) :
        (
          <div className="cards comments-card postcard " key={commentsdata?._id}>
            <div className="cards-content">
              {commentsdata?.comments?._id === "undefined"
              ? "" : 
              (<div className="comments-section">
                {commentsdata?.comments?.map((record) => {
                  return (
                    <>
                      <div className="comment-item">
                        <span className="comment-avatar">
                          <Link to={"/profile/" + record.postedBy[0]?._id}>
                            <img
                              src={record.postedBy[0]?.pic}
                              alt=""
                              className="circle"
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "16px",
                                marginLeft: "5px",
                              }}
                            />
                            {" "}
                          </Link>
                        </span>
                        <div className="comment-text-area">
                          <Link to={"/profile/" + record.postedBy[0]?._id}>
                            <span className="comment-username" style={{ fontWeight: "500" }}>
                              {record.postedBy[0]?.username}
                            </span>
                          </Link>
                          <span className="comment-text">
                            {record.text}
                          </span>
                          <span>
                            <h6 className="commenttime">
                              <span>
                                {moment().diff(moment(record.createdAt)) <
                                  7 * 24 * 60 * 60 * 1000
                                  ? moment(record.createdAt).fromNow()
                                  : moment(record.createdAt).calendar()}
                              </span>
                            </h6>
                          </span>
                        </div>
                      </div>
                    </>
                  );
                })}
                <div>
                </div>
                {commentsdata?.hasMoreComments ? (
                  <div className="addmore">
                    <button className="loadbtn" onClick={pageChange}>
                      <img src={addmore} />
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>)}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(comment, commentsdata._id);
                  setComment("")
                }}
                className="commentfooter"
              >
                <input type="text" placeholder="add a comment" onChange={(e) => { setComment(e.target.value) }} value={comment} />
                <button type="submit" onClick={(e) => {
                  e.preventDefault();
                  makeComment(comment, commentsdata._id);
                  setComment("")
                }}>
                  <img src={send} style={{ width: "25px" }} />
                </button>
              </form>
            </div>
          </div>
        )}{" "}
    </>
  );
};

export default Comments;
