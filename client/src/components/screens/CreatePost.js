import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authHeader } from "../../services/authHeaderConfig";
import axios from "axios";

const CreatePost = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [image, setImage] = useState("")
  const [url, setUrl] = useState("")

  const uploadPost = () => {
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
            toast.error(data.error);
          } else {
            toast.success("Post created successfully");
            navigate("/");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  useEffect(() => {
    const postImage = () => {
      const formData = new FormData();
      formData.append("file", image)
      formData.append("upload_preset", "social_network")
      formData.append("cloud_name", "digimode")
      axios.post(
        "https://api.cloudinary.com/v1_1/digimode/image/upload", formData)
        .then(res => res.data)
        .then(data => {
          setUrl(data.url)
        })
        .catch(err => {
          console.log(err)
        })
    }
    postImage();
  }, [image])



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
        onClick={() => uploadPost()}
      >
        Submit Post
      </button>
    </div>
  );
};

export default CreatePost;
