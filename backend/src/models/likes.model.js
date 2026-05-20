const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    reel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "reel",
        required: true
    }
}, {
    timestamps: true
})

const likeModel = mongoose.model("like", likeSchema);
module.exports = likeModel;