const userModel = require("../models/user.model")
const { uploadFile } = require("../services/storage.service")
const { v4: uuid } = require("uuid")

function getUserProfile(req, res) {
    const user = req.user;
    res.status(200).json({
        user: user
    })
}

async function updateUserProfile(req, res) {
    const user = req.user

    const uploadFileResult = await uploadFile(req.file.buffer, uuid())

    await userModel.findByIdAndUpdate(
        user._id,
        { profile_picture: uploadFileResult.url },
        { new: true }
    )

    res.status(201).json({
        message: "profile picture updated succesfully",
    })
}

async function updateUserBio(req, res) {
    const user = req.user
    const {bio } = req.body

    await userModel.findByIdAndUpdate(
        user._id,
        { bio: bio },
        { new: true }
    )

    res.status(201).json({
        success:true,
        message: "bio updated succesfully",
    })
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    updateUserBio
}
