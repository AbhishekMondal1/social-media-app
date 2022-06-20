const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types

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
    comments: [{
        type: new mongoose.Schema(
            {
                text: String,
                postedBy: { type: ObjectId, ref: "User" }
            },
            { timestamps: true }
        )
    }],
    likesCount: {
        type: Number,
        default: 0
    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },

}, { timestamps: true }
)

module.exports = mongoose.model("post", postSchema)