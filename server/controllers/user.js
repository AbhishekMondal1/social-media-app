const Post = require("../models/post");
const User = require("../models/user");

const getUser = (req, res) => {
    User.findOne({ _id: req.params.userid })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.userid })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                        return res.status(422).json({ error: err })
                    } console.log("u", user);
                    res.json({ user, posts })
                })
        }).catch(err => {
            return res.status(404).json({ error: "User not found" })
        })
};

const followUser = (req, res) => {
    console.log(req.user._id);
    User.findByIdAndUpdate(
        req.body.followId,
        { $push: { followers: req.user.id } },
        { new: true }
    ).then((use) => {
        console.log("use", use);
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

    //res.send(req.user.id)
};

const unfollowUser = (req, res) => {
    console.log(req.user._id);
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

    //res.send(req.user.id)
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
                res.json(result); console.log(result);
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
    getUser,
    followUser,
    unfollowUser,
    searchUsers,
    editBio,
    updateProfilePicture,
    getAllFollowings
}