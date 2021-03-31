const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const {SENDGRID_KEY} = require('../config/keys')
const requirelogin = require('../middleware/requireLogin')
const nodemailer = require('nodemailer')
const sendgridTranspost = require('nodemailer-sendgrid-transport')
const { log } = require('console')


const transposter = nodemailer.createTransport(sendgridTranspost({
    auth: {
        api_key: SENDGRID_KEY
    }
}
))



router.post('/signup',(req,res)=>{
   const {name,email,password,username,pic} = req.body
   if(!email || !password || !name || !username){
      return res.status(422).json({error:"Fill all Fields"})
   }
   User.findOne({email:email})
    .then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"User already exists"})
        }bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user = new User({
                email,
                password:hashedpassword,
                name,
                username,
                pic
            })
    
            user.save()
                .then(user => {
                    transposter.sendMail({
                        to: user.email,
                        from: "warriorofgalaxyandro@gmail.com",
                        subject: "signup success",
                        html:"<h1>Welcome to Connect All.</h1>"
                    })
                res.json({message:"Saved successfully"})
            })
            .catch(err=>{
                console.log(err)
            })
        })
      
    })
    .catch(err=>{
        console.log(err)
    })   
})


router.post('/signin',(req,res)=>{

    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).json({error:"Please enter Email or Password"})
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
           return res.status(422).json({error:"Invalid Email or Password"})
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
               // res.json({message:"successfully signed in"})
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                const {_id,name,email,username,followers,following, bio,pic} = savedUser
                res.json({ token, user: { _id, name, email, username, followers, following, bio, pic } })  
            }
            else{
                return res.status(422).json({error:"Invalid Email or Password"}) 
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
})

router.post('/reset-password', (req, res) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
        }
        const token = buffer.toString("hex")
        User.findOne({ email: req.body.email })
            .then(user => {
                if (!user) {
                    return res.status(422).json({ error: "User does not exists" })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                user.save().then(result => {
                    transposter.sendMail({
                        to: user.email,
                        from: "warriorofgalaxyandro@gmail.com",
                        subject: "Password Reset",
                        html: `
                        <p>Somebody requested for password reset</p>
                        <h5>Click this <a href="http://localhost:3000/reset/${token}"> link </a> to reset</h5>`
                    })
                    res.json({message:"Check your mail"})
                })
        })
    })
})

router.post('/new-password', (req, res) => {
    const newpassword = req.body.password
    const sentToken = req.body.token
    User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
        .then(user => {
            if (!user) {
                return res.status(422).json({ error: "Try again Sesion expired" })
            }
            bcrypt.hash(newpassword, 12).then(hashedpassword => {
                user.password = hashedpassword
                user.resetToken = undefined
                user.expireToken = undefined
                user.save()
                    .then((saveuser) => {
                    res.json({message:"Password updated success"})
                })
            })
                .catch(err => {
                console.log(err)
            })
    })
})

module.exports = router