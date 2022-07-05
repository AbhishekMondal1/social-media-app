const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");

const getAuthUser = (req, res) => {
    const { _id, username, name, pic, email, followers, following, provider, providerId } = req.user;
    res.json({ user: { _id, username, name, pic, email, followers, following, provider, providerId } });
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

const followUser = (req, res) => {
    User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user.id } },
        { new: true }
    ).then((use) => {
        User.findByIdAndUpdate(
            req.user._id,
            {
                $push: { following: req.body.followId }
            },
            { new: true }
        )
            .select("-password")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err });
                } else {
                    res.json(result);
                }
            });
    });
};

const unfollowUser = (req, res) => {
    User.findByIdAndUpdate(
        req.body.unfollowId,
        { $pull: { followers: req.user.id } },
    ).then((use) => {
        console.log("use", use);
        User.findByIdAndUpdate(
            req.user._id,
            {
                $pull: { following: req.body.unfollowId },
            },
        )
            .select("-password")
            .exec((err, result) => {
                if (err) {
                    return res.status(422).json({ error: err });
                } else {
                    res.json(result);
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

const editBio = (req, res) => {
    const userbio = req.body.text;
    User.findByIdAndUpdate(
        req.user._id,
        {
            bio: userbio
        },
        {
            new: true,
        }
    )
        .select("-password")
        .exec((err, result) => {
            if (err) {
                return res.status(422).json({ error: err });
            } else {
                res.json(result);
            }
        });
}

const updateProfilePicture = (req, res) => {
    User.findByIdAndUpdate(
        req.user._id,
        { $set: { pic: req.body.pic } },
        { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic canot post" });
            }
            res.json(result);
        }
    );
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
    editBio,
    updateProfilePicture,
    getAllFollowings
}