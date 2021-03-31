const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const commentSchema = new mongoose.Schema({
    text: String,
    postedBy: { type: ObjectId, ref: "User" },  
},
    {timestamps:true}
);

mongoose.model("comment", commentSchema)