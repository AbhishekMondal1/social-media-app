const express = require("express");
const router = express.Router();
const isAuthorized = require("../middleware/isAuthorized");
const { getAuthUser, getUser, followUser, unfollowUser, searchUsers, editProfile,
  updateProfilePicture, deleteProfilePicture, getAllFollowings, getAllFollowingUsers, getOnlineUsersDetails } = require("../controllers/user");

// get logged in user data
router.get('/auth/user', isAuthorized, getAuthUser);

// get user profile
router.get('/user/:userid', isAuthorized, getUser);

// follow users
router.put('/follow', isAuthorized, followUser);

// unfollow following users
router.put("/unfollow", isAuthorized, unfollowUser);

// search users
router.post('/search-users', isAuthorized, searchUsers);

// edit profile details
router.put("/editprofile", isAuthorized, editProfile);

// update profile picture
router.put("/updatepic", isAuthorized, updateProfilePicture);

// delete profile picture
router.delete("/updatepic", isAuthorized, deleteProfilePicture);

// get all followings
router.get("/followings/:userId", isAuthorized, getAllFollowings);

// get all followings
router.get("/followingusers/:userId", isAuthorized, getAllFollowingUsers);

// get online followings
router.post("/onlinefollowingusers", isAuthorized, getOnlineUsersDetails);

module.exports = router;