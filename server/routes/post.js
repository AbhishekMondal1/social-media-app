const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("post")

// get all posts 
router.get('/allpost', requireLogin, async (req, res) => {  
  const pagination = 4 
  const page = req.query.page ? parseInt(req.query.page) : 1
  const pagi = page * pagination
  //try {
  const totalPosts = await Post.estimatedDocumentCount()
  const totalPages = Math.ceil(totalPosts / pagination)
  const posts = await Post.find()
    .populate("postedBy", "_id username pic")
    .populate("comments.postedBy", "_id name username")
    .sort('-createdAt')
    .limit(page * pagination)
  const postsdata = []

  posts.map(data => {
    const viewerlikedpost = {viewerliked:false}
    viewerlikedpost.viewerliked = data.likes.includes(req.user._id) ? true : false
    const allpostdata = {...data.toObject(),...viewerlikedpost}   
    postsdata.push(allpostdata)     
  })
  console.log(postsdata)  
    res.json({
      totalPages,
      postsdata
    })   
})

// get all comments of a post
router.get('/allcomments/:postid', requireLogin, async (req, res) => {  
  const pagination = 5 
  console.log(req.query.page)
  const page = req.query.page ? parseInt(req.query.page) : 1
  const pagi = page * pagination
  //try {
  const totalPosts = await Post.estimatedDocumentCount()
  const totalPages = Math.ceil(totalPosts / pagination)
    const comments = await Post.findOne({ _id: req.params.postid },{"comments":{"$slice":pagi}})
    .populate("postedBy", "_id name username")
    .populate("comments.postedBy", "_id name username pic")
    .sort('-createdAt')
      .limit(page * pagination)
      console.log('com',comments);
      res.json({
          totalPages,
          comments,
        })
         
  console.log('cm',comments)  
  
})

// get all post of current logged in user
router.get('/post',requireLogin, async (req,res)=>{
  const posts = await Post.find({postedBy:{$in:req.user._id}})
    .populate("postedBy", "_id name username pic")
    .populate("comments.postedBy", "_id name username")
    .sort('-createdAt')
  const postsdata = []

  posts.map(data => {
    const viewerlikedpost = { viewerliked: false };
    viewerlikedpost.viewerliked = data.likes.includes(req.user._id) ? true : false;
    const allpostdata = { ...data.toObject(), ...viewerlikedpost }
    postsdata.push(allpostdata)
  })    
    res.json({postsdata})   
  })
  
  // get all followings post
  router.get('/getsubpost', requireLogin, async (req, res) => {
    const pagination = 1; 
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const posts = await Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name username pic")
    .populate("comments.postedBy", "_id name username")
    .sort("-createdAt")
    .limit(page * pagination)
    const postsdata = []

    posts.map(data => {
      const viewerlikedpost = { viewerliked: false };
      viewerlikedpost.viewerliked = data.likes.includes(req.user._id) ? true : false;
      const allpostdata = { ...data.toObject(), ...viewerlikedpost }
      postsdata.push(allpostdata)
    })
    console.log(postsdata)
  res.json({postsdata})
})

// create new post
router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic} = req.body
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all the fields"})
    }
    req.user.password = undefined
    const post = new Post({
        title,
        body, 
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err)
    })
})

// fetch a post
router.get('/post/:postid', requireLogin, (req, res) => {
  console.log(req.params.postid)
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
})

// like a post
router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
        $inc: {likesCount: 1}
      },
      {
        new: true
      }
    )
      .populate("postedBy", "_id name pic")
      .exec((err, result) => {
        if (err) { 
          return res.status(422).json({ error: err });
        } else {
          res.json(result);
        }
      });
})

// dislike a post
router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
      $inc: { likesCount: -1 },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name pic")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
});

// comment in a post
router.put('/comment', requireLogin, (req, res) => {
    const comment = {
        text: req.body.text,
        postedBy: req.user._id
    }
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
      })
      .populate("comments.postedBy", "_id name")
      .populate("postedBy","_id name")
      .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  })
})

// delete a post
router.delete('/deletepost/:postId',requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err,post) => {
      if (err || !post) {
        return res.status(422).json({ error: err })
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove()
          .then(result => {
          res.json(result)
          })
      }
  })
})

module.exports = router