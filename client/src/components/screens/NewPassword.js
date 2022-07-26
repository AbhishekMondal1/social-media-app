import React, { useState, useContext } from "react";
import { Link, useNavigate, useRouteMatch,useParams } from "react-router-dom";
import { toast } from "react-toastify";

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
