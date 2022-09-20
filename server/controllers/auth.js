const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTranspost = require('nodemailer-sendgrid-transport');
const User = require('../models/user');

const transposter = nodemailer.createTransport(
  sendgridTranspost({
    auth: {
      api_key: process.env.SENDGRID_KEY,
    },
  }),
);

const signup = (req, res) => {
  const { name, email, password, username, pic } = req.body;
  if (!email || !password || !name || !username) {
    return res.status(422).json({ error: 'Fill all Fields' });
  }
  User.findOne({ email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User already exists' });
      }
      bcrypt.hash(password, 12).then((hashedpassword) => {
        const user = new User({
          email,
          password: hashedpassword,
          name,
          username,
          pic,
          provider: 'localjwt',
        });
        user
          .save()
          .then((newUser) => {
            transposter.sendMail({
              to: newUser.email,
              from: 'warriorofgalaxyandro@gmail.com',
              subject: 'signup success',
              html: '<h1>Welcome to Connect All.</h1>',
            });
            res.json({ message: 'Saved successfully' });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

const signin = async (req, res) => {
  const { password } = req.body;
  const useremail = req.body.email;
  if (!useremail || !password) {
    return res.status(422).json({ error: 'Please enter Email or Password' });
  }

  try {
    const savedUser = await User.aggregate([
      {
        $match: {
          email: useremail,
        },
      },
      {
        $addFields: {
          totalFollowers: {
            $size: '$followers',
          },
          totalFollowing: {
            $size: '$following',
          },
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          username: 1,
          password: 1,
          pic: 1,
          bio: 1,
          provider: 1,
          totalFollowers: 1,
          totalFollowing: 1,
          createdAt: 1,
        },
      },
    ]);

    const doMatch = await bcrypt.compare(password, savedUser[0].password);
    if (doMatch) {
      const token = jwt.sign({ _id: savedUser[0]._id }, process.env.JWT_SECRET);
      const {
        _id,
        name,
        email,
        username,
        pic,
        totalFollowers,
        totalFollowing,
        bio,
        provider,
        createdAt,
      } = savedUser[0];
      res.json({
        token,
        user: {
          _id,
          name,
          email,
          username,
          pic,
          totalFollowers,
          totalFollowing,
          bio,
          provider,
          createdAt,
        },
      });
    } else {
      return res.status(422).json({ error: 'Invalid Email or Password' });
    }
  } catch (error) {
    return res.status(422).json({ error: 'Invalid Email or Password' });
  }
};

const resetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email }).then((oldUser) => {
      if (!oldUser) {
        return res.status(422).json({ error: 'User does not exists' });
      }
      const user = oldUser;
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((savedUser) => {
        transposter.sendMail({
          to: savedUser.email,
          from: 'warriorofgalaxyandro@gmail.com',
          subject: 'Password Reset',
          html: `
                        <p>Somebody requested for password reset</p>
                        <h5>Click this <a href="http://localhost:3000/reset/${token}"> link </a> to reset</h5>`,
        });
        res.json({ message: 'Check your mail' });
      });
    });
  });
};

const setNewPassword = (req, res) => {
  const newpassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({
    resetToken: sentToken,
    expireToken: { $gt: Date.now() },
  }).then((oldUser) => {
    if (!oldUser) {
      return res.status(422).json({ error: 'Try again Sesion expired' });
    }
    bcrypt
      .hash(newpassword, 12)
      .then((hashedpassword) => {
        const user = oldUser;
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then(() => {
          res.json({ message: 'Password updated success' });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports = {
  signup,
  signin,
  resetPassword,
  setNewPassword,
};
