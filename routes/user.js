const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("post");
const User = mongoose.model("User")


router.get('/user/:userid',requireLogin,(req, res) => {
    User.findOne({ _id: req.params.userid })
        .select("-password")
        .then(user => {
            Post.find({ postedBy: req.params.userid })
                .populate("postedBy", "_id name")
                .exec((err, posts) => {
                    if (err) {
                    return res.status(422).json({error:err})
                    }console.log("u",user);
                    res.json({user,posts})
            })
        }).catch(err => {
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow', requireLogin, (req, res) => {
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
})
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

router.put("/unfollow", requireLogin, (req, res) => {
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
});
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
router.post('/search-users', (req, res) => {
  let userPattern = new RegExp("^" + req.body.query)
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then(user => {
      res.json({ user })
    }).catch(err => {
    console.log(err)
  })
})


router.put("/editbio", requireLogin, (req, res) => {
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
});

router.put('/updatepic', requireLogin, (req, res) => {
  User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
    (err,result)=>{
      if(err){
        return res.status(422).json({error:"pic canot post"})
      }
      res.json(result)
    })
  })

module.exports = router;