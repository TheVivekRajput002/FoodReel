const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    profile_picture: {
        type: String,
        default: "https://i.pinimg.com/736x/f5/47/d8/f547d800625af9056d62efe8969aeea0.jpg"
    },
    bio: {
        type: String,
        default: "new user"
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String
    },
    followingCount: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0,
        required: true
    },
    streak: {
        type: Number,
        default: 0,
        required: true
    }
},
    {
        timestamps: true
    }
)

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
