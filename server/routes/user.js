const express = require("express");
const router = express.Router();
const isAuthorized = require("../middleware/isAuthorized");
const { getAuthUser, getUser, followUser, unfollowUser, searchUsers, editBio,
  updateProfilePicture, getAllFollowings } = require("../controllers/user");

// get logged in user data
router.get('/auth/user', isAuthorized, getAuthUser);

// get user profile
router.get('/user/:userid', isAuthorized, getUser);

// follow users
router.put('/follow', isAuthorized , followUser);

// unfollow following users
router.put("/unfollow", isAuthorized, unfollowUser);

// search users
router.post('/search-users', isAuthorized, searchUsers);

// edit profile bio
router.put("/editbio", isAuthorized, editBio);

// update profile picture
router.put("/updatepic", isAuthorized, updateProfilePicture);

// get all followings
router.get("/followings/:userId", isAuthorized, getAllFollowings);

module.exports = router;