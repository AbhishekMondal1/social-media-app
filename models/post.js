const mongoose = require('mongoose')
const commentSchema = require('./comment')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [commentSchema],
    likesCount: {
        type: Number,
        default: 0    
    },
    postedBy:{
        type:ObjectId,
        ref:"User"
    },

},{timestamps:true}
)

mongoose.model("post",postSchema)