import React, {useState} from "react";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
const Signin = () => {
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
       M.toast({
        html: "Invalid Email",
        classes: "#ff1744 red accent-3",
       })
      return
    }
    fetch("/signin", {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
        } else {
          M.toast({ html: "signed in success", classes: "#1976d2 blue darken-2" });
          history.push("/");
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
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-2"
          type="submit"
          name="action"
          onClick={()=>PostData()}
        >
          Login
        </button>
        <h5>
          <Link to="/signup"> Don't have an account?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
