const mongoose = require("mongoose")

const reelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    video: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "creator"
    },
    likeCount: {
        type: Number,
        default: 0
    },
    bookmarkCount: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type:String,
        required: true
    },
})

const reelModel = mongoose.model("reel", reelSchema)

module.exports = reelModel
