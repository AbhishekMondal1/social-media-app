const mongoose = require('mongoose');
const Post = require('../models/post');

// get all timeline posts
const getAllPosts = async (req, res) => {
  const perPage = 4;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const pageLimit = page * perPage;
  const skipLimit = perPage * (page - 1);
  const totalPosts = await Post.estimatedDocumentCount();
  const totalPages = Math.ceil(totalPosts / perPage);
  const hasMorePages = page < totalPages;

  try {
    const allposts = await Post.aggregate([
      { $sort: { createdAt: -1 } },
      { $limit: pageLimit },
      { $skip: skipLimit },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy',
        },
      },
      {
        $addFields: {
          comments: { $slice: ['$comments', -1] },
          commentsCount: { $size: '$comments' },
          likesCount: { $size: '$likes' },
          viewerliked: { $in: [req.user._id, '$likes'] },
        },
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.postedBy',
          foreignField: '_id',
          as: 'comments.postedBy',
        },
      },
      {
        $group: {
          _id: '$_id',
          body: {
            $first: '$body',
          },
          createdAt: {
            $first: '$createdAt',
          },
          commentsCount: {
            $first: '$commentsCount',
          },
          likesCount: {
            $first: '$likesCount',
          },
          viewerliked: {
            $first: '$viewerliked',
          },
          title: {
            $first: '$title',
          },
          postedBy: {
            $first: '$postedBy',
          },
          photo: {
            $first: '$photo',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          comments: {
            $push: '$comments',
          },
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $project: {
          body: 1,
          createdAt: 1,
          commentsCount: 1,
          likesCount: 1,
          viewerliked: 1,
          photo: 1,
          title: 1,
          updatedAt: 1,
          'postedBy._id': 1,
          'postedBy.name': 1,
          'postedBy.username': 1,
          'postedBy.pic': 1,
          'comments.text': 1,
          'comments._id': 1,
          'comments.createdAt': 1,
          'comments.updatedAt': 1,
          'comments.postedBy._id': 1,
          'comments.postedBy.name': 1,
          'comments.postedBy.username': 1,
          'comments.postedBy.pic': 1,
        },
      },
    ]);

    res.json({
      allposts,
      hasMorePages,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get posts' });
  }
};

// get all posts of current user
const getUserPosts = async (req, res) => {
  const userid = mongoose.Types.ObjectId(req.user._id);
  try {
    const postsdata = await Post.aggregate([
      {
        $match: {
          postedBy: userid,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          createdAt: 1,
          photo: 1,
          title: 1,
        },
      },
    ]);
    res.json({
      postsdata,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user posts' });
  }
};

// get all post of a user profile
const getUsersPostList = async (req, res) => {
  const perPage = 9;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const pageLimit = page * perPage;
  const skipLimit = perPage * (page - 1);

  try {
    const totalPosts = await Post.aggregate([
      {
        $match: { postedBy: mongoose.Types.ObjectId(req.params.userid) },
      },
      {
        $count: 'total',
      },
    ]);
    const totalNumberOfPosts = totalPosts[0].total;
    const totalPages = Math.ceil(totalNumberOfPosts / perPage);
    const hasMorePages = page < totalPages;

    const postlists = await Post.aggregate([
      {
        $match: { postedBy: mongoose.Types.ObjectId(req.params.userid) },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: pageLimit,
      },
      {
        $skip: skipLimit,
      },
      {
        $project: {
          photo: 1,
          body: 1,
          createdAt: 1,
        },
      },
    ]);

    return res.json({
      postlists,
      hasMorePages,
      totalNumberOfPosts,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to get user posts' });
  }
};

// get following users posts
const getFollowingsPosts = async (req, res) => {
  const perPage = 4;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  const pageLimit = page * perPage;
  const skipLimit = perPage * (page - 1);

  try {
    const totalPosts = await Post.aggregate([
      {
        $match: { postedBy: { $in: req.user.following } },
      },
      {
        $count: 'total',
      },
    ]);
    const totalPages = Math.ceil(totalPosts[0].total / perPage);
    const hasMorePages = page < totalPages;
    const allFollowingPosts = await Post.aggregate([
      {
        $match: {
          postedBy: {
            $in: req.user.following,
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: pageLimit,
      },
      {
        $skip: skipLimit,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy',
        },
      },
      {
        $addFields: {
          comments: {
            $slice: ['$comments', -1],
          },
          commentsCount: {
            $size: '$comments',
          },
          likesCount: {
            $size: '$likes',
          },
          viewerliked: {
            $in: [req.user._id, '$likes'],
          },
        },
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.postedBy',
          foreignField: '_id',
          as: 'comments.postedBy',
        },
      },
      {
        $group: {
          _id: '$_id',
          body: {
            $first: '$body',
          },
          createdAt: {
            $first: '$createdAt',
          },
          commentsCount: {
            $first: '$commentsCount',
          },
          likesCount: {
            $first: '$likesCount',
          },
          viewerliked: {
            $first: '$viewerliked',
          },
          title: {
            $first: '$title',
          },
          postedBy: {
            $first: '$postedBy',
          },
          photo: {
            $first: '$photo',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          comments: {
            $push: '$comments',
          },
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $project: {
          body: 1,
          createdAt: 1,
          commentsCount: 1,
          likesCount: 1,
          viewerliked: 1,
          photo: 1,
          title: 1,
          updatedAt: 1,
          'postedBy._id': 1,
          'postedBy.name': 1,
          'postedBy.username': 1,
          'postedBy.pic': 1,
          'comments.text': 1,
          'comments._id': 1,
          'comments.createdAt': 1,
          'comments.updatedAt': 1,
          'comments.postedBy._id': 1,
          'comments.postedBy.name': 1,
          'comments.postedBy.username': 1,
          'comments.postedBy.pic': 1,
        },
      },
    ]);
    res.json({
      allFollowingPosts,
      hasMorePages,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get following users posts' });
  }
};

const createPost = (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: 'Please add all the fields' });
  }
  req.user.password = undefined;
  const post = new Post({
    title,
    body,
    photo: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// fetch single post
const getPost = async (req, res) => {
  if (!req.params.postid) {
    res.status(500).json({
      error: 'no postid received',
    });
  }

  const id = mongoose.Types.ObjectId(req.params.postid);
  try {
    const singlepost = await Post.aggregate([
      { $match: { _id: id } },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy',
        },
      },
      {
        $project: {
          body: 1,
          createdAt: 1,
          likesCount: { $size: '$likes' },
          title: 1,
          photo: 1,
          updatedAt: 1,
          viewerliked: { $in: [req.user._id, '$likes'] },
          'postedBy._id': 1,
          'postedBy.name': 1,
          'postedBy.username': 1,
          'postedBy.pic': 1,
        },
      },
    ]);
    res.json({
      singlepost,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get post' });
  }
};

// like a post
const likePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    },
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    res.json({
      viewerliked: true,
      _id: result._id,
    });
  });
};

// dislike a post
const dislikePost = (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    },
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    }
    res.json({
      viewerliked: false,
      _id: result._id,
    });
  });
};

// get all comments of a single post
const getAllComments = async (req, res) => {
  const perPage = 4;
  const page = req.query.page ? parseInt(req.query.page, 10) : 1;
  let pageLimit = 1;
  if (req.query.newpage) {
    console.log(req.query.newpage);
    pageLimit = page * perPage + 2;
  } else {
    pageLimit = page * perPage;
  }

  if (!req.params.postid) {
    res.status(500).json({
      error: 'no postid received',
    });
  }

  const postId = mongoose.Types.ObjectId(req.params.postid);

  try {
    const allpostdata = await Post.aggregate([
      { $match: { _id: postId } },
      {
        $lookup: {
          from: 'users',
          localField: 'postedBy',
          foreignField: '_id',
          as: 'postedBy',
        },
      },
      {
        $unwind: {
          path: '$comments',
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: { 'comments.createdAt': -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'comments.postedBy',
          foreignField: '_id',
          as: 'comments.postedBy',
        },
      },
      {
        $group: {
          _id: '$_id',
          body: {
            $first: '$body',
          },
          createdAt: {
            $first: '$createdAt',
          },
          updatedAt: {
            $first: '$updatedAt',
          },
          likes: {
            $first: '$likes',
          },
          title: {
            $first: '$title',
          },
          postedBy: {
            $first: '$postedBy',
          },
          photo: {
            $first: '$photo',
          },
          comments: {
            $push: '$comments',
          },
        },
      },
      {
        $addFields: {
          comments: { $slice: ['$comments', pageLimit] },
          commentsCount: { $size: '$comments' },
          likesCount: { $size: '$likes' },
          viewerliked: { $in: [req.user._id, '$likes'] },
        },
      },
      {
        $project: {
          body: 1,
          createdAt: 1,
          likesCount: 1,
          commentsCount: 1,
          title: 1,
          photo: 1,
          updatedAt: 1,
          viewerliked: 1,
          hasMoreComments: {
            $cond: [{ $gt: ['$commentsCount', pageLimit] }, true, false],
          },
          'postedBy._id': 1,
          'postedBy.name': 1,
          'postedBy.username': 1,
          'postedBy.pic': 1,
          'comments.text': 1,
          'comments._id': 1,
          'comments.createdAt': 1,
          'comments.updatedAt': 1,
          'comments.postedBy._id': 1,
          'comments.postedBy.name': 1,
          'comments.postedBy.username': 1,
          'comments.postedBy.pic': 1,
        },
      },
    ]);
    res.json({
      comments: allpostdata,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user posts' });
  }
};

// comment on post
const commentOnPost = async (req, res) => {
  if (!req.body.text) {
    res.status(500).json({
      error: 'Please provide a message with your comment.',
    });
  }

  const objectid = mongoose.Types.ObjectId();
  const comment = {
    _id: objectid,
    text: req.body.text,
    postedBy: req.user._id,
  };

  try {
    const post = await Post.findByIdAndUpdate(
      req.body.postId,
      {
        $push: { comments: comment },
      },
      {
        new: true,
      },
    );
    if (post) {
      const latestComment = await Post.aggregate([
        {
          $match: {
            'comments._id': objectid,
          },
        },
        {
          $project: {
            comments: 1,
          },
        },
        {
          $unwind: {
            path: '$comments',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            'comments._id': objectid,
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'comments.postedBy',
            foreignField: '_id',
            as: 'comments.postedBy',
          },
        },
        {
          $project: {
            'comments.text': 1,
            'comments._id': 1,
            'comments.createdAt': 1,
            'comments.updatedAt': 1,
            'comments.postedBy._id': 1,
            'comments.postedBy.name': 1,
            'comments.postedBy.username': 1,
            'comments.postedBy.pic': 1,
          },
        },
      ]);
      const newComment = [];
      newComment.push(latestComment[0].comments);
      console.log(newComment);
      res.json({
        c: newComment,
      });
    }
  } catch (error) {
    res.status(500).json({
      error: 'Failed to comment',
    });
  }
};

const deletePost = (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
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
};

module.exports = {
  getAllPosts,
  getAllComments,
  getUserPosts,
  getUsersPostList,
  getFollowingsPosts,
  createPost,
  getPost,
  likePost,
  dislikePost,
  commentOnPost,
  deletePost,
};
