const express = require('express');
const isAuthorized = require('../middleware/isAuthorized');

const router = express.Router();
const {
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
} = require('../controllers/post');

// get all posts
router.get('/allpost', isAuthorized, getAllPosts);

// get all comments of a post
router.get('/allcomments/:postid', isAuthorized, getAllComments);

// get all post of current logged in user
router.get('/post', isAuthorized, getUserPosts);

// get all post of a user profile
router.get('/userspostlist/:userid', isAuthorized, getUsersPostList);

// get all followings post
router.get('/getsubpost', isAuthorized, getFollowingsPosts);

// create new post
router.post('/createpost', isAuthorized, createPost);

// fetch a post
router.get('/post/:postid', isAuthorized, getPost);

// like a post
router.put('/like', isAuthorized, likePost);

// dislike a post
router.put('/unlike', isAuthorized, dislikePost);

// comment in a post
router.put('/comment', isAuthorized, commentOnPost);

// delete a post
router.delete('/deletepost/:postId', isAuthorized, deletePost);

module.exports = router;
