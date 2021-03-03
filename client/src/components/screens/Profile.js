import React, { useEffect, useState, useContext } from "react";
import {Link,useParams} from 'react-router-dom'
import {UserContext} from '../../App'
const Profile = () => {
  const [mypics, setPics] = useState([])  
  const {state,dispatch} = useContext(UserContext)
  const [data, setData] = useState([state]);
    const { postid } = useParams();
  useEffect(() => {
    fetch('/post', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(state)
        console.log("result",result);
        setPics(result.posts)
    })
  }, [])
  
  const editBio = (text) => { 
    console.log(text)
    fetch("/editbio", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        text
      }),
    })
      .then((res) => res.json())
      .then((result) => { console.log(result);
        const newData = result;
        /*const newData = data.map((item) => {
          if (item._id == result._id) {
            return result;
          } else {
            return item;
          }
        });*/
        console.log("nwq", result);
        console.log("nw",newData);
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ maxWidth: "550px", margin: "0px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div>
          <img
            style={{ width: "160px", height: "160px", borderRadius: "80px" }}
            src={state?state.pic:"loading"}
          />
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <h4>{state ? state.email : "loading"}</h4>
          <h4>{state ? state.username : "loading"}</h4>
          <h5>{state ? state.bio : "loading"}</h5>
                   
          <form
            onSubmit={(e) => {
              e.preventDefault();
              editBio(e.target[0].value);
            }}
          >
            <input type="text" placeholder="add bio" />
          </form>
          <h5
            key="1"
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black" }}
          >
            edit
          </h5>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{mypics ? mypics.length:"0"} posts</h6>
            <h6>{state ? state.followers.length : "0"} followers</h6>
            <h6>{state ? state.following.length : "0"} folllowing</h6>
          </div>
        </div>
      </div>
      <div className="gallary">
        {mypics.map((item) => {
          return (
            <>
              <Link
                to={"/post/" + item._id}
              >
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                />
              </Link>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Profile;