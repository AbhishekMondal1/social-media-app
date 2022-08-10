import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext/UserContext";
import annyang from "annyang";
import GoogleBtn from "../GoogleBtn/GoogleBtn";

const Signin = () => {
  const { userDispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = (e) => {
    e.preventDefault();
    if (
      !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email,
      )
    ) {
      toast.error("Invalid Email");
      return;
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
        console.log("sign", data);
        if (data.error) {
          toast.error(data.error);
        } else {
          console.log(data.token);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          userDispatch({ type: "USER", payload: data.user });
          toast.success("Signin Successful");
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Anny = () => {
    if (annyang) {
      console.log("running anny");
      // Let's define our first command. First the text we expect, and then the function it should call
      var commands = {
        "change heading": function () {
          console.log("speaking");
          document.getElementById("para2").innerHTML = "New para";
        },
        "change para": function () {
          document.getElementById("para2").innerHTML = "Latest para";
        },
        "change heading again": function () {
          document.getElementById("para2").innerHTML = "Old para";
        },
        "write email *tag": function (variable) {
          console.log(variable);
          let eml = document.getElementsByTagName("input")[1];
          eml.value = variable;
        },
        "click login": function () {
          document.getElementsByClassName("btn")[0].click();
        },
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start();
    }
  };
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2> Connect All </h2>
        <form onSubmit={(e) => PostData(e)}>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-2"
            type="submit"
            name="action"
            onClick={(e) => PostData(e)}
          >
            Login
          </button>
          <button
            className="btn waves-effect waves-light #64b5f6 blue darken-2"
            onClick={() => Anny()}
          >
            Voice Cmd
          </button>

          <a href="http://localhost:5000/auth/google">
            <GoogleBtn title={"Sign in with Google"} />
          </a>
          <h5>
            <Link to="/signup"> {`Don't have an account?`}</Link>
          </h5>
          <h6>
            <Link to="/reset"> Forgot Password?</Link>
          </h6>
        </form>
      </div>
    </div>
  );
};

export default Signin;
