const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
    },
    username: {
        type: String,
        required:true
    },
    bio: {
        type:String,
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/cloudaditya/image/upload/v1610609840/noimages_r1ckl0.png"
    },
    role: {
        type: String,
        default: "member"  
    },
    provider: {
        type: String,
        default: "localjwt"
    },
    providerId:{
        type:String,
        required: false
    },
    resetToken: String,
    expireToken: Date,
    followers: [{type:ObjectId,ref:"User"}],
    following: [{type:ObjectId,ref:"User"}]
},{timestamps:true}
)

module.exports = mongoose.model("User",userSchema)