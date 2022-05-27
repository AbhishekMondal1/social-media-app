const Post = require("../models/post")

const getAllPosts = async (req, res) => {
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
    const viewerlikedpost = { viewerliked: false }
    viewerlikedpost.viewerliked = data.likes.includes(req.user._id) ? true : false
    const allpostdata = { ...data.toObject(), ...viewerlikedpost }
    postsdata.push(allpostdata)
  })
  console.log(postsdata)
  res.json({
    totalPages,
    postsdata
  })
};


const getAllComments = async (req, res) => {
  const pagination = 5
  console.log(req.query.page)
  const page = req.query.page ? parseInt(req.query.page) : 1
  const pagi = page * pagination
  //try {
  const totalPosts = await Post.estimatedDocumentCount()
  const totalPages = Math.ceil(totalPosts / pagination)
  const comments = await Post.findOne({ _id: req.params.postid }, { "comments": { "$slice": pagi } })
    .populate("postedBy", "_id name username")
    .populate("comments.postedBy", "_id name username pic")
    .sort('-createdAt')
    .limit(page * pagination)
  console.log('com', comments);
  res.json({
    totalPages,
    comments,
  })
  console.log('cm', comments)
};

const getUserPosts = async (req, res) => {
  const posts = await Post.find({ postedBy: { $in: req.user._id } })
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
  res.json({ postsdata })
};

const getFollowingsPosts = async (req, res) => {
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
  res.json({ postsdata })
};

const createPost = (req, res) => {
  const { title, body, pic } = req.body
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Please add all the fields" })
  }
  req.user.password = undefined
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user
  })
  post.save().then(result => {
    res.json({ post: result })
  })
    .catch(err => {
      console.log(err)
    })
};

const getPost = (req, res) => {
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
};

const likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
      $inc: { likesCount: 1 }
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
};

const dislikePost = (req, res) => {
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
};

const commentOnPost = (req, res) => {
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
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    })
};

const deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
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
};

module.exports = {
  getAllPosts,
  getAllComments,
  getUserPosts,
  getFollowingsPosts,
  createPost,
  getPost,
  likePost,
  dislikePost,
  commentOnPost,
  deletePost
}