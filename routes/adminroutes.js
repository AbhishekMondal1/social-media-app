const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const requireAdminLogin = require('../middleware/requireAdminLogin');
const Post = mongoose.model("post");
const User = mongoose.model("User");
const Report = mongoose.model("report")

router.get("/totalusers", requireAdminLogin, (req, res) => {
  User.estimatedDocumentCount()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      console.log(err); 
    });
});



router.get("/user/:userid", requireAdminLogin, (req, res) => {
  User.findOne({ _id: req.params.userid })
    .select("-password")
    .then((user) => {
      Post.find({ postedBy: req.params.userid })
        .populate("postedBy", "_id name")
        .exec((err, posts) => {
          if (err) {
            return res.status(422).json({ error: err });
          }
          console.log("u", user);
          res.json({ user, posts });
        });
    })
    .catch((err) => {
      return res.status(404).json({ error: "User not found" });
    });
});


router.post("/search-users", (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then((user) => {
      res.json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/report/:reportid", requireAdminLogin, (req, res) => {
  console.log(req.params.postid);
  Post.findOne({ _id: req.params.postid })
    .populate("postedBy", "_id name username")
    .populate("comments.postedBy", "_id name username")
    .then((mypost) => {
      res.json({ mypost });
      console.log(mypost);
    })
    .catch((err) => {
      console.log(err);
    });
});


router.get("/post/:postid", requireAdminLogin, (req, res) => {
  console.log(req.params.postid);
  Post.findOne({ _id: req.params.postid })
    .populate("postedBy", "_id name username")
    .populate("comments.postedBy", "_id name username")
    .then((mypost) => {
      res.json({ mypost });
      console.log(mypost);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/deletepost/:postId", requireAdminLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: err });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove().then((result) => {
          res.json(result);
        });
      }
    });
});




module.exports = router;
