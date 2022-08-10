import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AdminSignup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);
  const uploadpic = () => {
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
        setUrl(data.url);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const uploadFields = () => {
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      toast.error("Invalid Email");
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
        //username
        //email,
        username,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          navigate("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // return (
  //}
  const PostData = () => {
    if (image) {
      uploadpic();
    } else {
      uploadFields();
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2> Connect All </h2>
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
          onClick={() => PostData()}
        >
          Signup
        </button>
        <h5>
          <a href="http://localhost:5000/auth/google">Login with Google</a>
        </h5>
        <h5>
          <Link to="/signin"> Already have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default AdminSignup;
