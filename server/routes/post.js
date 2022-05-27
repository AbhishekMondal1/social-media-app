const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');
const { getAllPosts, getAllComments, getUserPosts, getFollowingsPosts, createPost,
  getPost, likePost, dislikePost, commentOnPost, deletePost } = require("../controllers/post");

// get all posts 
router.get('/allpost', requireLogin, getAllPosts);

// get all comments of a post
router.get('/allcomments/:postid', requireLogin, getAllComments);

// get all post of current logged in user
router.get('/post', requireLogin, getUserPosts);

// get all followings post
router.get('/getsubpost', requireLogin, getFollowingsPosts);

// create new post
router.post('/createpost', requireLogin, createPost);

// fetch a post
router.get('/post/:postid', requireLogin, getPost);

// like a post
router.put('/like', requireLogin, likePost);

// dislike a post
router.put("/unlike", requireLogin, dislikePost);

// comment in a post
router.put('/comment', requireLogin, commentOnPost);

// delete a post
router.delete('/deletepost/:postId', requireLogin, deletePost);

module.exports = router;