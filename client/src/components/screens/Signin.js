import React, { useState, useContext } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { UserContext } from '../../context/UserContext/UserContext'
import M from "materialize-css";
import annyang from 'annyang'
import GoogleBtn from "../GoogleBtn/GoogleBtn";

const Signin = () => {
  const { userState, userDispatch } = useContext(UserContext)
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = (e) => {
    e.preventDefault();
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
        console.log('sign', data)
        if (data.error) {
          M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
        } else {
          console.log(data.token);
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          userDispatch({ type: "USER", payload: data.user })
          M.toast({ html: "signed in success", classes: "#1976d2 blue darken-2" });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const Anny = () => {
    if (annyang) {
      console.log('running anny');
      // Let's define our first command. First the text we expect, and then the function it should call
      var commands = {
        "change heading": function () {
          console.log("speaking")
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
          document.getElementsByClassName("btn")[0].click()
        }
      };

      // Add our commands to annyang
      annyang.addCommands(commands);

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start();
    }
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
        <h2> Connect All </h2>
        <form
          onSubmit={(e) => PostData(e)}
        >
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
            <GoogleBtn title={"Sign in with Google"}/>
          </a>
          <h5>
            <Link to="/signup"> Don't have an account?</Link>
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
