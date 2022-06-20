import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";

const CreatePost = () => {
  const history = useHistory();
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")
  useEffect(() => {
    if (url) {
      axios.post("/createpost", {
        title,
        body,
        pic: url,
      }, {
        headers: authHeader(),
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#ff1744 red accent-3" });
          } else {
            M.toast({
              html: "Created post successfully",
              classes: "#1976d2 blue darken-2",
            });
            history.push("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [url])

  const postDetails = () => {
    const data = new FormData()
    data.append("file", image)
    data.append("upload_preset", "social_network")
    data.append("cloud_name", "digimode")
    axios.post(
      "https://api.cloudinary.com/v1_1/digimode/image/upload", {
      data
    })
      .then(res => res.data)
      .then(data => {
        setUrl(data.url)
      })
      .catch(err => {
        console.log(err)
      })

  };

  return (
    <div
      className="card input-field"
      style={{
        margin: "30px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="btn  #64b5f6 blue darken-1">
          <span>Upload image</span>
          <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" />
        </div>
      </div>
      <button
        className="btn waves-effect waves-light #64b5f6 blue darken-1"
        type="submit"
        name="action"
        onClick={() => postDetails()}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
