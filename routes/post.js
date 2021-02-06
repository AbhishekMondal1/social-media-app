const { response } = require('express')
const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("post")

router.get('/allpost', requireLogin, (req, res) => {
 /* let pageNo = parseInt(req.query.pageNo)
  let size = parseInt(req.query.size)
  let query = {}
  if (pageNo < 0 || pageNo === 0) {
    return res.json({ error: "invalid page no"})
  }
  query.skip = size * (pageNo - 1)
  query.limit = size
  Post.count({}, (err, totalCount) => {
    if (err) {
     let response = {"error": true, "message":"error fetching data"}
    }
    Post.find({}, {}, query, (err, data) => {
      if (err) {
        response = {"error":true,"message":"Error fetching data"}
      } else {
        let totalPages = Math.ceil(totalCount / size)
        response = {
          "error":false,"message":data,"pages":totalPages
        }
        res.json(response)
      }
    })
  })*/
  const pagination = 4 // parseInt(req.query.pagination)
  const page= req.query.page ? parseInt(req.query.page) : 1
    Post.find()
        .populate("postedBy", "_id name username")
      .populate("comments.postedBy", "_id name username")
      .sort('-createdAt')
      .limit(page*pagination)
      //.skip((page - 1) * pagination)
      .then(posts => {
        console.log('pg',page)
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })    
})

router.get('/mypost',requireLogin,(req,res)=>{
    Post.find({postedBy:{$in:req.user._id}})
        .populate("postedBy", "_id name username")
      .populate("comments.postedBy", "_id name username")
      .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })    
})

router.get('/getsubpost', requireLogin, (req, res) => {
    const pagination = 1; // parseInt(req.query.pagination)
    const page = req.query.page ? parseInt(req.query.page) : 1;
    Post.find({postedBy:{$in:req.user.following}})
        .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt")
      .limit(page*pagination)
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })    
})

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

router.get('/mypost/:postid', requireLogin, (req, res) => {
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

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { likes: req.user._id },
      },
      {
        new: true,
      }
    )
      .populate("postedBy", "_id name")
      .exec((err, result) => {
        if (err) { 
          return res.status(422).json({ error: err });
        } else {
          res.json(result);
        }
      });
})

router.put("/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate("postedBy", "_id name")
    .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
});

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