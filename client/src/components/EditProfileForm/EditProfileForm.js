import React, { useRef, useState, useContext, useEffect } from "react";
import { authHeader } from "../../services/authHeaderConfig";
import Tooltip from "../Tooltip/Tooltip";
import "./EditProfileForm.css";
import axios from "axios";
import { UserContext } from "../../context/UserContext/UserContext";

const EditProfileForm = () => {
  const [details, setDetails] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    pic: "",
  });
  const [detailsError, setDetailsError] = useState({
    nameerr: "",
    usernameerr: "",
    bioerr: "",
    emailerr: "",
  });
  const { userState, userDispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  const inputFileRef = useRef();

  useEffect(() => {
    axios
      .get("/auth/user", {
        withCredentials: "true",
        headers: authHeader(),
      })
      .then((res) => res.data)
      .then((res) => {
        if (res.error) {
          console.log("ERROR");
        } else {
          const { name, username, bio, email, pic } = res.user;
          setDetails((prev) => ({
            ...prev,
            name: name,
            username: username,
            bio: bio,
            email: email,
            pic: pic,
          }));
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormInputFocus = (e) => {
    const { name } = e.target;
    const errorKey = `${name}err`;
    setDetailsError((prev) => ({
      ...prev,
      [errorKey]: "",
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const name_regex = /^[a-zA-Z ]{2,30}$/;
    const username_regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim;
    const bio_regex = /^.*[\S\n\t\s]{1,200}$/im;
    const email_regex =
      /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?/.()<>[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?/.()<>[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d-]+(?:\.[a-zA-Z\d-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;
    let inputError = false;
    if (name_regex.test(details.name) === false) {
      setDetailsError((prev) => ({
        ...prev,
        nameerr: "Please enter correct name",
      }));
      inputError = true;
    }
    if (username_regex.test(details.username) === false) {
      setDetailsError((prev) => ({
        ...prev,
        usernameerr:
          "Username should be 1-30 characters and should not include special characters",
      }));
      inputError = true;
    }
    if (bio_regex.test(details.bio) === false) {
      setDetailsError((prev) => ({
        ...prev,
        bioerr: "Bio should be 1-200 characters long",
      }));
      inputError = true;
    }
    if (email_regex.test(details.email) === false) {
      setDetailsError((prev) => ({
        ...prev,
        emailerr: "Please enter a valid email",
      }));
      inputError = true;
    }
    if (inputError === false) {
      axios
        .put(
          "/editprofile",
          {
            name: details.name,
            username: details.username,
            bio: details.bio,
            email: details.email.toLocaleLowerCase(),
          },
          {
            headers: authHeader(),
          },
        )
        .then((res) => res.data)
        .then((res) => {
          const { name, username, bio, email, pic } = res.updatedUser[0];
          setDetails((prev) => ({
            ...prev,
            name: name,
            username: username,
            bio: bio,
            email: email,
            pic: pic,
          }));
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...userState,
              name: res.updatedUser[0].name,
              username: res.updatedUser[0].username,
              bio: res.updatedUser[0].bio,
              email: res.updatedUser[0].email,
              pic: res.updatedUser[0].pic,
            }),
          );
          userDispatch({ type: "USER", payload: res.updatedUser[0] });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleBrowseFile = (e) => {
    e.preventDefault();
    inputFileRef.current.click();
  };

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "social_network");
      data.append("cloud_name", "digimode");
      axios
        .post("https://api.cloudinary.com/v1_1/digimode/image/upload", data)
        .then((res) => res.data)
        .then((res) => {
          axios
            .put(
              "/updatepic",
              {
                pic: res.url,
              },
              {
                headers: authHeader(),
              },
            )
            .then((res) => res.data)
            .then((res) => {
              const { name, username, bio, email, pic } = res.updatedUser[0];
              setDetails((prev) => ({
                ...prev,
                name: name,
                username: username,
                bio: bio,
                email: email,
                pic: pic,
              }));
              localStorage.setItem(
                "user",
                JSON.stringify({
                  ...userState,
                  name: res.updatedUser[0].name,
                  username: res.updatedUser[0].username,
                  bio: res.updatedUser[0].bio,
                  email: res.updatedUser[0].email,
                  pic: res.updatedUser[0].pic,
                }),
              );
              userDispatch({
                type: "UPDATEPIC",
                payload: res.updatedUser[0].pic,
              });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const handleRemoveProfilePicture = (e) => {
    e.preventDefault();
    axios
      .delete("/updatepic", {
        headers: authHeader(),
      })
      .then((res) => res.data)
      .then((res) => {
        const { name, username, bio, email, pic } = res.updatedUser[0];
        setDetails((prev) => ({
          ...prev,
          name: name,
          username: username,
          bio: bio,
          email: email,
          pic: pic,
        }));
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...userState,
            name: res.updatedUser[0].name,
            username: res.updatedUser[0].username,
            bio: res.updatedUser[0].bio,
            email: res.updatedUser[0].email,
            pic: res.updatedUser[0].pic,
          }),
        );
        userDispatch({ type: "UPDATEPIC", payload: res.updatedUser[0].pic });
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  return (
    <div>
      <h5>Edit Profile</h5>
      <article className="main-article">
        <div className="avatar-wrapper">
          <div>
            <img className="fimage" src={userState?.pic || details.pic} />
          </div>
          <div className="avatar-btn">
            <button onClick={handleBrowseFile}>Change profile photo</button>
            <input
              className="inputfile"
              ref={inputFileRef}
              type="file"
              name="file"
              id="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setImage(e.target.files[0])}
            />
            <button onClick={handleRemoveProfilePicture}>
              Remove current photo
            </button>
          </div>
        </div>
        <div className="form-wrapper">
          <form onSubmit={handleFormSubmit}>
            <div className="flexrow">
              <label htmlFor="name">Name</label>
              <input
                className="input"
                type="text"
                name="name"
                id="fname"
                placeholder="name"
                value={details.name}
                onChange={handleFormInputChange}
                onFocus={handleFormInputFocus}
              />
            </div>
            {detailsError.nameerr && <Tooltip title={detailsError.nameerr} />}
            <div className="flexrow">
              <label htmlFor="fusername">Username</label>
              <input
                className="input"
                type="text"
                name="username"
                id="fusername"
                placeholder="username"
                value={details.username}
                onChange={handleFormInputChange}
                onFocus={handleFormInputFocus}
              />
            </div>
            {detailsError.usernameerr && (
              <Tooltip title={detailsError.usernameerr} />
            )}
            <div className="flexrow">
              <label htmlFor="fbio">Bio</label>
              <textarea
                className="textarea"
                type="text"
                name="bio"
                id="fbio"
                placeholder="bio"
                value={details.bio}
                onChange={handleFormInputChange}
                onFocus={handleFormInputFocus}
              />
            </div>
            {detailsError.bioerr && <Tooltip title={detailsError.bioerr} />}
            <div className="flexrow">
              <label htmlFor="femail">Email</label>
              <input
                className="input"
                type="text"
                name="email"
                id="femail"
                placeholder="email"
                value={details.email}
                onChange={handleFormInputChange}
                onFocus={handleFormInputFocus}
              />
            </div>
            {detailsError.emailerr && <Tooltip title={detailsError.emailerr} />}
            <button className="btn-submit" type="submit">
              Submit
            </button>
          </form>
        </div>
      </article>
    </div>
  );
};

export default EditProfileForm;
