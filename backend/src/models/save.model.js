const mongoose = require("mongoose");

const saveSchema = new mongoose.Schema({
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

const saveModel = mongoose.model("save", saveSchema);
module.exports = saveModel;