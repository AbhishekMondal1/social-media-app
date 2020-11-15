const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model('User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

const requirelogin = require('../middleware/requireLogin')

router.post('/signup',(req,res)=>{
   const {name,email,password} = req.body
   if(!email || !password || !name){
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
                name
            })
    
            user.save()
            .then(user=>{
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
                const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                res.json({token})
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

module.exports = router