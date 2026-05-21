const mongoose = require("mongoose")

const creatorSchema = new mongoose.Schema({
    profile_picture: {
        type: String,
        default: ""
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    { timestamps: true }
)

const creatorModel = mongoose.model("Creator", creatorSchema);

module.exports = creatorModel;