const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types;

const reportSchema = new mongoose.Schema({
    reporter_id: {
        type: Number,
        required: true,
    },
    post_id: {
        type: ObjectId,
        ref: "Post",
    },
    report_text: {
        type: String,
        required: true,        
    }
},{timestamps:true}
)

mongoose.model("report", reportSchema)