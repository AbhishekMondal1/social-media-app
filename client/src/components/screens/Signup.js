import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from 'materialize-css'
import GoogleBtn from "../GoogleBtn/GoogleBtn";

const Signup = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState(
    "https://res.cloudinary.com/cloudaditya/image/upload/v1610609840/noimages_r1ckl0.png"
  );

  useEffect(() => {
    if (image) {
      uploadPic()
    }
  }, [image])

  const uploadPic = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "social_network")
    data.append("cloud_name", "digimode")
    fetch(
      "https://api.cloudinary.com/v1_1/digimode/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setUrl(data.url)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const uploadFields = (e) => {
    e.preventDefault();
    if (!
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        .test(email)) {
      M.toast({ html: "Invalid Email", classes: "#ff1744 red accent-3" });
      return;
    }
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
        password
      )
    ) {
      M.toast({ html: "<h6>password must include @,#,% or &special characters<div>atleast 1 uppercase, lowercase, number</div>", classes: "#ff1744 red accent-3" });
      return;
    }
    fetch("/signup", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email: email.toLowerCase(),
        username,
        pic: url
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
        } else {
          M.toast({ html: data.message, classes: "#1976d2 blue darken-2" });
          navigate.push('/signin')
        }
      }).catch(err => {
        console.log(err)
      })


  }

  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2> Connect All </h2>
        <form
          onSubmit={(e) => uploadFields(e)}
        >
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="file-field input-field">
            <div className="btn  #64b5f6 blue darken-1">
              <span>Upload pic</span>
              <input type="file" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-2"
            type="submit"
            name="action"
            onClick={(e) => uploadFields(e)}
          >
            Signup
          </button>
          <h5>
            <a href="http://localhost:5000/auth/google">
              <GoogleBtn title={"Sign up with Google"} />
            </a>
          </h5>
          <h5>
            <Link to="/signin"> Already have an account?</Link>
          </h5>
        </form>
      </div>
    </div>
  );
};

export default Signup;
