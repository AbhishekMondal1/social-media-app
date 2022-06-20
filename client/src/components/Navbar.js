import React, { useContext, useRef, useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App'
import "./navbar.css";
import M from 'materialize-css';
import searchicon from "./icons/search.svg";
import sendmsgicon from "./icons/sendmsg.svg";
import exploreicon from "./icons/compass.svg";
import newposticon from "./icons/plussquare.svg";
import logouticon from "./icons/logout.svg";

const NavBar = () => {
  const searchModal = useRef(null)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const { state, dispatch } = useContext(UserContext)
  const history = useHistory()
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList = () => {
    if (state) {
      console.log(state)
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
                src={state.pic}
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
            <Link to="/messages">
            <img src={sendmsgicon} />
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
          <li key="7"
          style={{ color: "black",  marginTop: "10px" }}>
            <button
              className="btnexit"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
            >
              <img src={logouticon} />
             </button>
          </li>
        </>)
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
  }

  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users',
      {
        method: "post",
        headers: {
          "Content-Type": "Application/json"
        },
        body: JSON.stringify({ query }
        )
      })
      .then(res => res.json())
      .then(results => {
        setUserDetails(results.user)
      })
  }
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
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
            {userDetails.map(item => {
              return (
                <Link to={item._id !== state._id ? "/profile/" + item._id : "/profile"} onClick={() => {
                  M.Modal.getInstance(searchModal.current).close()
                  setSearch("")
                }}>
                  <li className="collection-item">{item.username}</li>
                </Link>
              );
            })}
          </ul>
        </div>
        <div className="modal-footer">
          <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch("")}>
            Close
          </button>
        </div>
      </div>
    </nav>
  );
}
export default NavBar