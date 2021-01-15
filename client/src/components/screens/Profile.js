import React,{useEffect,useState,useContext} from "react";
import {UserContext} from '../../App'
const Profile = () => {
  const [mypics, setPics] = useState([])  
  const {state,dispatch} = useContext(UserContext)
  const [data, setData] = useState([state]);
  useEffect(() => {
    fetch('/mypost', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
      .then(result => {
        console.log(state)
        console.log(result);
        setPics(result.mypost)
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
            src="https://images.unsplash.com/photo-1485206412256-701ccc5b93ca?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
          />
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <h4>{state ? state.email : "loading"}</h4>
          <h4>{state ? state.username : "loading"}</h4>
          <h5>{data.bio ? data.bio : state.bio}</h5>
                   
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
            <h6>{mypics.length} posts</h6>
            <h6>{state ? state.followers.length : "0"} followers</h6>
            <h6>{state ? state.following.length : "0"} folllowing</h6>
          </div>
        </div>
      </div>
      <div className="gallary">
        {mypics.map((item) => {
          return (
            <img
              key={item._id}
              className="item"
              src={item.photo}
              alt={item.title}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Profile;