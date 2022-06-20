import React, { useState, useEffect, useContext, useRef } from "react";
import { UserContext } from "../../App";
import { Link } from 'react-router-dom'
import moment from 'moment'
import { authHeader } from "../../services/authHeaderConfig";
import "./post.css";
import send from "../icons/plane.svg";
import axios from "axios";

const Post = ({ item, individualpost, data, setData }) => {
    const [loading, setLoading] = useState(true)
    const [comment, setComment] = useState("")
    const { state, dispatch } = useContext(UserContext)
    const likeBtn = useRef(null)

    const likeClick = (id) => {
        const favorite = document.createElement('i')
        favorite.classList.add("material-icons");
        favorite.innerHTML = "favorite"
        likeBtn.current.appendChild(favorite)
        setTimeout(() => {
            favorite.remove()
        }, 1000)
    }

    const likepost = (id) => {
        axios.put('/like', {
            postId: id
        }, {
            headers: authHeader(),
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
                        console.log(item, result, "rs")
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
        <div className={`${individualpost? 'cards postcard2 comments-card2 leftbd' : 'card home-card'}`} key={item._id}>
                <div tabIndex={0} style={{ padding: "5px" }}>
                    <Link
                        to={
                            item.postedBy._id !== state?._id
                                ? "/profile/" + item.postedBy._id
                                : "/profile"
                        }
                    >
                        <div className="avatar">
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
                        </div>
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

            <div
                className="card-image"
                key={item._id}
                onClick={() => {
                    likeClick(item._id);
                    !item.viewerliked && likepost(item._id)
                }}
                ref={likeBtn}
            >
                <img src={item.photo} alt="" />
            </div>
            <div className="cards-content">
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
                <p>
                    <span>{item.postedBy.username}</span>
                    &nbsp;{item.body}
                </p>
                {individualpost || (
                    <>
                        {item.comments.slice(0, 1).map((record) => {
                            return (
                                <h6 key={record._id}>
                                    <span style={{ fontWeight: "500" }}>
                                        {record.postedBy.name}
                                    </span>{" "}
                                    {record.text}
                                    <h6 className="commenttime">
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
                        <Link to={"/post/" + item._id}>
                            <p>view all {item.comments.length} comments</p>
                        </Link>
                    </>
                )
                }
                {individualpost || (
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            makeComment(comment, item._id);
                            setComment("")
                        }}
                        className="commentfooter"
                    >
                        <input type="text" placeholder="add a comment" onChange={(e) => { setComment(e.target.value) }} value={comment} />
                        <button type="submit" onClick={(e) => {
                            e.preventDefault();
                            makeComment(comment, item._id);
                            setComment("")
                        }}>
                            <img src={send} style={{ width: "25px" }} />
                        </button>
                    </form>
                )
                }
                <h6 className="posttime">
                    {moment().diff(moment(item.createdAt)) <
                        7 * 24 * 60 * 60 * 1000
                        ? moment(item.createdAt).fromNow()
                        : moment(item.createdAt).calendar()}
                </h6>
            </div>
        </div>
    );
}

export default Post;