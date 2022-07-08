const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");

const getAuthUser = async (req, res) => {
    const { _id, username, name, bio, pic, email, followers, following, provider, providerId } = await req.user;
    res.json({ user: { _id, username, name, bio, pic, email, followers, following, provider, providerId } });
}

// get user profile
const getUser = async (req, res) => {
  const userid = mongoose.Types.ObjectId(req.params.userid);
  try {
    const user = await User.aggregate([
      {
        $match: {
          "_id": userid,
        }
      }, {
        $addFields: {
          totalFollowers: {
            "$size": "$followers"
          },
          totalFollowing: {
            "$size": "$following"
          },
          follows: {
            $in: [req.user._id, "$followers"]
          }
        }
      }, {
        $project: {
          name: 1,
          pic: 1,
          username: 1,
          bio: 1,
          follows: 1,
          totalFollowers: 1,
          totalFollowing: 1,
          createdAt: 1
        }
      }
    ])
    res.json({
      user,
    })
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" })
  }
};

// follow a user
const followUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId, {
    $push: { followers: req.user.id }
  },
  ).then(() => {
    User.findByIdAndUpdate(
      req.user._id, {
      $push: { following: req.body.followId }
    },
    )
      .select("-password")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          if (result) {
            const followResult = { follows: true }
            res.json(followResult);
          }
        }
      });
  });
};

// unfollow a user
const unfollowUser = (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId, {
    $pull: { followers: req.user.id }
  },
  ).then(() => {
    User.findByIdAndUpdate(
      req.user._id, {
      $pull: { following: req.body.unfollowId },
    },
    )
      .select("-password")
      .exec((err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        } else {
          if (result) {
            const unfollowResult = { follows: false }
            res.json(unfollowResult);
          }
        }
      });
  });
};

const searchUsers = (req, res) => {
    let userPattern = new RegExp("^" + req.body.query)
    User.find({ username: { $regex: userPattern } })
        .select("_id username")
        .then(user => {
            res.json({ user })
        }).catch(err => {
            console.log(err)
        })
};

// get updated user details aggregation pipeline
const getUpdatedUser = async (userid) => {
  const user = await User.aggregate([
    {
      $match: {
        "_id": userid,
      }
    }, {
      $addFields: {
        totalFollowers: {
          "$size": "$followers"
        },
        totalFollowing: {
          "$size": "$following"
        },
      }
    }, {
      $project: {
        name: 1,
        username: 1,
        email: 1,
        bio: 1,
        pic: 1,
        totalFollowers: 1,
        totalFollowing: 1,
        createdAt: 1,
        updatedAt: 1,
        role: 1,
        provider: 1,
      }
    }
  ])
  return user
}

// edit user profile
const editProfile = async (req, res) => {
  const { username, name, bio, email } = req.body;
  const name_regex = /^[a-zA-Z ]{2,30}$/;
  const username_regex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/igm;
  const bio_regex = /^.*[\S\n\t\s]{1,200}$/im;
  const email_regex = /^(?:(?:[\w`~!#$%^&*\-=+;:{}'|,?\/]+(?:(?:\.(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)*"|[\w`~!#$%^&*\-=+;:{}'|,?\/]+))*\.[\w`~!#$%^&*\-=+;:{}'|,?\/]+)?)|(?:"(?:\\?[\w`~!#$%^&*\-=+;:{}'|,?\/\.()<>\[\] @]|\\"|\\\\)+"))@(?:[a-zA-Z\d\-]+(?:\.[a-zA-Z\d\-]+)*|\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])$/;

  if (!name_regex.test(name) ||
    !username_regex.test(username) ||
    !bio_regex.test(bio) ||
    !email_regex.test(email)) {
    return res.status(422).json({ error: "Invalid input" });
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username,
        name,
        bio,
        email
      },
      {
        new: true,
      }
    )
      .select("-password")
      .select("-followers")
      .select("-following")
    if (!user) {
      return res.status(422).json({ error: "user not found" });
    } else {
      const userid = mongoose.Types.ObjectId(req.user._id);
      const updatedUser = await getUpdatedUser(userid)
      res.json({
        updatedUser,
      })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" })
  }
}

//update profile picture
const updateProfilePicture = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { pic: req.body.pic } },
      { new: true }
    )
      .select("-password")
      .select("-followers")
      .select("-following")
    if (!user) {
      return res.status(422).json({ error: "image can not be updated." });
    }
    else {
      const userid = mongoose.Types.ObjectId(req.user._id);
      const updatedUser = await getUpdatedUser(userid)
      res.json({
        updatedUser,
      })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" })
  }
}

// delete profile picture
const deleteProfilePicture = async (req, res) => {
  const pic = "https://res.cloudinary.com/cloudaditya/image/upload/v1610609840/noimages_r1ckl0.png";
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { pic: pic } },
      { new: true }
    )
      .select("-password")
      .select("-followers")
      .select("-following")
    if (!user) {
      return res.status(422).json({ error: "can't remove picture" });
    }
    else {
      const userid = mongoose.Types.ObjectId(req.user._id);
      const updatedUser = await getUpdatedUser(userid)
      res.json({
        updatedUser,
      })
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get user data" })
  }
}

const getAllFollowings = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const followings = await Promise.all(
            user.following.map((followingId) => {
                return User.findById(followingId);
            })
        );
        let followingList = [];
        followings.map((friend) => {
            const { _id, username, name, pic } = friend;
            followingList.push({ _id, username, name, pic });
        });
        res.status(200).json(followingList);
    } catch (err) {
        res.status(500).json(err);
    }
};

module.exports = {
    getAuthUser,
    getUser,
    followUser,
    unfollowUser,
    searchUsers,
    editProfile,
    updateProfilePicture,
    deleteProfilePicture,
    getAllFollowings
}