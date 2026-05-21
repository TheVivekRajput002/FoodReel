const mongoose = require("mongoose")

const savedReelSchema = new mongoose.Schema({
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
}
    ,
    {
        timestamps: true
    }
)

const savedReelModel = mongoose.model("savedReel", savedReelSchema)

module.exports = savedReelModel;

