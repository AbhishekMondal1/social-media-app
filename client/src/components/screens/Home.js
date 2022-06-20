import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from '../../App'
import { Link } from 'react-router-dom'
import moment from 'moment'
import Stories from "./Stories";
import { authHeader } from '../../services/authHeaderConfig';
import axios from "axios";

const Home = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [totalpage, setTotalPage] = useState(0)
  const [likedpost, setLikePost] = useState(false)
  const [loading, setLoading] = useState(true)
  const { state, dispatch } = useContext(UserContext)
  const likeBtn = useRef(null)

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

  const likeClick = (id) => {
    console.log('liked')
    const favorite = document.createElement('i')
    favorite.classList.add("material-icons");
    favorite.innerHTML = "favorite"
    likeBtn.current.appendChild(favorite)
    console.log(likeBtn.current)
    setTimeout(() => {
      favorite.remove()
    }, 1000)
    setLikePost(true)
    //likeBtn.current  // appendChild(document.createElement('i'))
  }

  const likepost = (id) => {
    axios.put('/like', {
      postId: id
    }, {
      headers: authHeader()
    })
      .then(res => res.data)
      .then(result => {
        const newData = data.map(item => {
          if (item._id === result._id) {
            return result
          }
          else {
            return item
          }
        });
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }

  const unlikepost = (id) => {
    axios.put('/unlike',
      { postId: id },
      {
        headers: authHeader(),
      })
      .then(res => res.data)
      .then(result => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const makeComment = (text, postId) => {
    axios.put('/comment', {
      text,
      postId
    },
      {
        headers: authHeader(),
      })
      .then(res => res.data)
      .then(result => {
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        })
        setData(newData)
      }).catch(err => {
        console.log(err)
      })
  }

  const deletePost = (postid) => {
    axios.delete(`/deletepost/${postid}`, {
      headers: authHeader(),
    })
      .then(res => res.json)
      .then(result => {
        const newData = data.filter(item => {
          return item._id !== result._id
        })
        setData(newData)
      })
  }



  return (
    <div className="home">
      <Stories />
      {data.map((item) => {
        return (
          <div className="card home-card" key={item._id}>
            <h5 style={{ padding: "5px" }}>
              <div>
                <Link
                  to={
                    item.postedBy._id !== state?._id
                      ? "/profile/" + item.postedBy._id
                      : "/profile"
                  }
                >
                  <img
                    src={item.postedBy.pic}
                    alt=""
                    className="circle"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "16px",
                      marginLeft: "5px",
                    }}
                  />
                  <span className="uname">{item.postedBy.username} </span>
                </Link>
                <span>
                  {item.postedBy._id === state?._id && (
                    <i
                      className="material-icons"
                      style={{
                        float: "right",
                      }}
                      onClick={() => deletePost(item._id)}
                    >
                      delete
                    </i>
                  )}
                </span>
              </div>
            </h5>

            <div
              className="card-image"
              key={item._id}
              onClick={() => likeClick(item._id)}
              ref={likeBtn}
            >
              <img src={item.photo} alt="" />
            </div>
            <div className="card-content">
              {item.viewerliked ? (
                <i
                  className="material-icons"
                  onClick={() => unlikepost(item._id)}
                >
                  favorite
                </i>
              ) : (
                <i
                  className="material-icons"
                  onClick={() => likepost(item._id)}
                >
                  favorite_border
                </i>
              )}
              <Link to={"/allcomments/" + item._id}>
                <i className="material-icons">comment</i>
              </Link>
              <h6>{item.likesCount} likes</h6>
              <h6>{item.title}</h6>
              <p>
                <span>{item.postedBy.name}</span>
                &nbsp;{item.body}
              </p>
              {item.comments.slice(0, 2).map((record) => {
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
              <Link to={"/allcomments/" + item._id}>
                <p>view all {item.comments.length} comments</p>
              </Link>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  makeComment(e.target[0].value, item._id);
                }}
              >
                <input type="text" placeholder="add a comment" />
                <h6>
                  {moment().diff(moment(item.createdAt)) <
                    7 * 24 * 60 * 60 * 1000
                    ? moment(item.createdAt).fromNow()
                    : moment(item.createdAt).calendar()}
                </h6>
              </form>
            </div>
          </div>
        );
      })}
      {loading ? <h1>Loading...</h1> : ""}
    </div>
  );
}

export default Home;