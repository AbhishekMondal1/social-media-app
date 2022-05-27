const express = require("express");
const router = express.Router();
const requireLogin = require("../middleware/requireLogin");
const { getUser, followUser, unfollowUser, searchUsers, editBio,
  updateProfilePicture, getAllFollowings } = require("../controllers/user");

// get user profile
router.get('/user/:userid', requireLogin, getUser);

// follow users
router.put('/follow', requireLogin, followUser);
/*
router.put('/follow', requireLogin, (req, res) => {
    //res.send(req.user)
    User.findByIdAndUpdate(
        req.body.followId,
        {
            $push: { followers: req.user._id }
        },
        //{ useFindAndModify: false },
        { new: true }
        , (err, result) => {
            if (err) {
                return res.status(422).json({ error: err })
            }
        
        User.findByIdAndUpdate(
            req.user._id,
            {
            $push: { following: req.body.followId }
            },
            { new: true }.select("-password")

        )
            /*.exec((err, result) => {
            if (err) { 
             return res.status(422).json({ error: err });
             } else {
             res.json(result);
             }
            });*/
/* **     .then(result => { 
        res.json(result)
        //console.log(result)
    }).catch(err => { 
    return res.status(422).json({error:err})
}) 
}
)    ***/
/*.exec((err, result) => {
  if (err) {
    return res.status(422).json({ error: err });
  } else {
    res.json(result);
  }
});*/
//}) 
/*
router.put("/follow", requireLogin, (req, res) => {
  //res.send(req.user)
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    //{ useFindAndModify: false },
    { new: true }
  )*/
/*, (err, result) => {
    if (err) {
        return res.status(422).json({error:err})
    }
   User.findByIdAndUpdate(req.user._id, {
        $push: { following: req.body.followId }
    }, { new: true }.select("-password"))*/
/*  .exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });*/
/*.then(result => {
              res.json(result)
              //console.log(result)
          }).catch(err => { 
          return res.status(422).json({error:err})
      }) */
// }
//)
//});

// unfollow following users
router.put("/unfollow", requireLogin, unfollowUser);
/*
router.put('/unfollow',requireLogin,(req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {
        $pull:{followers:req.user._id}
    }, { new: true }
    , (err, result) => {
        if (err) {
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id, {
            $pull: { following: req.body.unfollowId }
        }, { new: true }.select("-password"))
            .then(result => {
            res.json(result)
            }).catch(err => {
            return res.status(422).json({error:err})
        })
        }
    )
})
*/

//search users
router.post('/search-users', searchUsers);

// edit profile bio
router.put("/editbio", requireLogin, editBio);

// update profile picture
router.put("/updatepic", requireLogin, updateProfilePicture);

// get all followings
router.get("/followings/:userId", getAllFollowings);

module.exports = router;