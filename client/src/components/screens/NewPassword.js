import React, { useState, useContext } from "react";
import { Link, useNavigate, useRouteMatch,useParams } from "react-router-dom";

import M from "materialize-css";
const NewPassword = () => {
  const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const { token } = useParams()
    console.log(token);
  const PostData = () => {
     
    fetch("/new-password", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
          password,
          token
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
        } else {
          M.toast({
            html: data.message,
            classes: "#1976d2 blue darken-2",
          });
          navigate.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2> Connect All </h2>
        
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-2"
          type="submit"
          name="action"
          onClick={() => PostData()}
        >
          Update Password
        </button>
        
      </div>
    </div>
  );
};

export default NewPassword;
