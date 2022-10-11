import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { UserContext } from "../context/UserContext/UserContext";
import "./navbar.css";
import M from "materialize-css";
import searchicon from "./icons/search.svg";
import sendmsgicon from "./icons/sendmsg.svg";
import notification from "./icons/bell.svg";
import exploreicon from "./icons/compass.svg";
import newposticon from "./icons/plussquare.svg";
import logouticon from "./icons/logout.svg";
import { SocketContext } from "../context/SocketContext/SocketContext";
import { NotificationContext } from "../context/NotificationContext/NotificationContext";
import Notifications from "./Notifications/Notifications";

const NavBar = () => {
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const navigate = useNavigate();
  const { userState, userDispatch } = useContext(UserContext);
  const { socketState } = useContext(SocketContext);
  const { notificationState, notificationDispatch } =
    useContext(NotificationContext);

  useEffect(() => {
    if (userState?._id)
      socketState.notificationSocket?.emit("joinNotification", userState._id);
  }, [userState?._id]);

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  useEffect(() => {
    if (notificationState.newNotification.length > 0) {
      toast(
        <Notifications notification={notificationState.newNotification[0]} />,
        {
          position: "top-left",
          autoClose: 50000,
          hideProgressBar: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          newestOnTop: true,
          draggablePercent: 60,
        },
      );
    }
  }, [notificationState.newNotification]);

  useEffect(() => {
    socketState.notificationSocket?.on(
      "getNotification",
      ({ notificationSend }) => {
        notificationDispatch({
          type: "ADD_NOTIFICATION",
          payload: { notificationSend },
        });
        notificationDispatch({
          type: "ADD_NEW_NOTIFICATION",
          payload: { notificationSend },
        });
      },
    );
  }, [socketState]);

  const logout = async () => {
    localStorage.clear();
    userDispatch({ type: "CLEAR" });
    axios.get("/logout").then((res) => {
      if (res.data.message === "Logged out successfully") {
        navigate("/signin");
      }
    });
  };

  const renderList = () => {
    if (userState) {
      return (
        // [
        <>
          <li
            key="1"
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{ color: "black", marginTop: "21px" }}
          >
            <img src={searchicon} />
          </li>
          <li
            key="2"
            className="material-icons"
            style={{ color: "black", marginTop: "21px" }}
          >
            <Link to="/profile">
              <img
                src={userState.pic}
                alt=""
                className="circle"
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "16px",
                  marginLeft: "5px",
                  objectFit: "cover",
                }}
              />
            </Link>
          </li>
          <li
            key="3"
            className="material-icons"
            style={{ color: "black", marginTop: "21px" }}
          >
            <Link to="/create">
              <img src={newposticon} />
            </Link>
          </li>
          <li
            key="4"
            className="material-icons"
            style={{ color: "black", marginTop: "21px" }}
          >
            <Link to="/myfollowingpost">
              <img src={exploreicon} />
            </Link>
          </li>
          <li
            key="5"
            className="material-icons"
            style={{ color: "black", marginTop: "21px" }}
          >
            <Link to="/notifications">
              <img src={notification} />
            </Link>
          </li>
          <li
            key="6"
            className="material-icons"
            style={{ color: "black", marginTop: "21px" }}
          >
            <Link to="/chatmessages">
              <img src={sendmsgicon} />
            </Link>
          </li>
          <li key="7" style={{ color: "black", marginTop: "10px" }}>
            <button
              className="btnexit"
              onClick={() => {
                logout();
              }}
            >
              <img src={logouticon} />
            </button>
          </li>
        </>
      );
      // ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">signin</Link>
        </li>,
        <li key="7">
          <Link to="/signup">signup</Link>
        </li>,
      ];
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={userState ? "/" : "/signin"} className="brand-logo left">
          Connect All
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
            {userDetails.map((item, i) => {
              return (
                <Link
                  to={
                    item._id !== userState._id
                      ? "/profile/" + item._id
                      : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                  key={i}
                >
                  <li className="collection-item">{item.username}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};
export default NavBar;
