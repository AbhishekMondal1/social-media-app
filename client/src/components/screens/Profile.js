import React, { useEffect, useState, useContext } from "react";
import {Link,useParams} from 'react-router-dom'
import { UserContext } from '../../App'
const Profile = () => {
  const [mypics, setPics] = useState([])  
  const {state,dispatch} = useContext(UserContext)
  const [data, setData] = useState([state]);
  const [image, setImage] = useState("");
    const { postid } = useParams();
  useEffect(() => {
    fetch('/post', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(state)
        setPics(result.postsdata)
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

   useEffect(() => {
     if (image) {
       const data = new FormData();
       data.append("file", image);
       data.append("upload_preset", "social_network");
       data.append("cloud_name", "digimode");
       fetch("https://api.cloudinary.com/v1_1/digimode/image/upload", {
         method: "post",
         body: data,
       })
         .then((res) => res.json())
         .then((data) => {
           // localStorage.setItem("user",JSON.stringify({...state,pic:data.url}))
           // dispatch({type:"UPDATEPIC",payload:data.url})
           fetch("/updatepic", {
             method: "put",
             headers: {
               "content-type": "application/json",
               Authorization: "Bearer " + localStorage.getItem("jwt"),
             },
             body: JSON.stringify({
               pic: data.url,
             }),
           })
             .then((res) => res.json())
             .then((result) => {
               console.log(result);
               localStorage.setItem(
                 "user",
                 JSON.stringify({ ...state, pic: result.pic })
               );
               dispatch({ type: "UPDATEPIC", payload: result.pic });
             });
         })
         .catch((err) => {
           console.log(err);
         });
     }
   }, [image]);
   const updatephoto = (file) => {
     setImage(file);
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
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              objectFit: "cover",
            }}
            src={state ? state.pic : "loading"}
          />
        </div>
        <div>
          <h4
            className="pname"
            style={{ textDecoration: "uppercase", fontSize: "30px" }}
          >
            {state ? state.name : "loading"}
          </h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6 className="">{mypics ? mypics.length : "0"} posts</h6>
            <h6 className="">
              {state ? state.followers.length : "0"} followers
            </h6>
            <h6 className="">
              {state ? state.following.length : "0"} folllowing
            </h6>
          </div>
          <h4 className="uname">{state ? state.username : "loading"}</h4>
          <h5 className="ubio">{state ? state.bio : "loading"}</h5>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              editBio(e.target[0].value);
            }}
          >
            <input type="text" placeholder="add bio" />
          </form>
        </div>
      </div>
      <div
        className="file-field input-field"
        style={{
          margin: "10px 0px 0px 50px",
          width: "22%",
          bottom: "108px",
          left: "15px",
        }}
      >
        <div className="btn  #64b5f6 blue darken-1">
          <span>Update pic</span>
          <input type="file" onChange={(e) => updatephoto(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <div className="gallary">
        {mypics.map((item) => {
          return (
            <>
              <Link to={"/post/" + item._id}>
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