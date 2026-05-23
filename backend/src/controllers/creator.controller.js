const creatorModel = require('../models/creator.model')
const userModel = require('../models/user.model')
const reelModel = require("../models/reel.model")
const stackModel = require("../models/stack.model")
const followModel = require("../models/follow.model")
const { uploadFile } = require("../services/storage.service")
const { checkAchievements } = require("../services/achievement.service")
const jwt = require("jsonwebtoken")
const { v4: uuid } = require("uuid")

async function getCreatorById(req, res) {
    const creatorId = req.params.id

    const creator = await creatorModel.findById(creatorId).select("-password")
    const [reels, stacks] = await Promise.all([
        reelModel.find({ creator: creatorId }).sort({ createdAt: -1 }),
        stackModel.find({ creator: creatorId }).sort({ createdAt: -1 }),
    ])

    if (!creator) {
        return res.status(404).json({ message: "food partner not found" })
    }

    let isFollowed = false
    const token = req.cookies?.token

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await userModel.findById(decoded.id)

            if (user) {
                const existing = await followModel.findOne({
                    user: user._id,
                    creator: creatorId,
                })
                isFollowed = !!existing
            }
        } catch {
            // Optional auth: ignore invalid tokens for public profile views.
        }
    }

    res.status(200).json({
        message: "food partner details received successfully",
        creator,
        reels,
        stacks,
        isFollowed,
    })
}

async function getCreatorProfile(req, res) {
    const creator = req.creator
    const reels = await reelModel.find({ creator: creator._id }).sort({ createdAt: -1 })

    res.status(200).json({
        sucess: true,
        creator: creator,
        reels: reels
    })
}

async function followCreator(req, res) {
    const creatorId = req.params.id
    const userId = req.user._id

    const existing = await followModel.findOne({ user: userId, creator: creatorId })

    if (existing) {
        await followModel.deleteOne({ user: userId, creator: creatorId });
        await userModel.findByIdAndUpdate(userId, { $inc: { followingCount: -1 } })
        await creatorModel.findByIdAndUpdate(creatorId, { $inc: { followersCount: -1 } })
        return res.json({ success: true, action: "unfollowed" });
        
    } else {
        
        await followModel.create({ user: userId, creator: creatorId });
        await userModel.findByIdAndUpdate(userId, { $inc: { followingCount: +1 } })
        await creatorModel.findByIdAndUpdate(creatorId, { $inc: { followersCount: +1 } })

        const unlocked = await checkAchievements(userId, "USER_FOLLOWED")

        return res.json({
            success: true,
            action: "followed",
            unlockedBadges: unlocked.map((entry) => entry.badge),
        });
    }
}

async function updateCreatorProfile(req, res) {
    const creator = req.creator
    
    if (!req.file) {
        return res.status(400).json({
            message: "profile picture file is required",
        })
    }

    const uploadFileResult = await uploadFile(req.file.buffer, uuid())
    const profilePicture = uploadFileResult.url

    await creatorModel.findByIdAndUpdate(
        creator._id,
        { profile_picture: profilePicture },
        { new: true }
    )

    res.status(201).json({
        message: "profile picture updated succesfully",
        profile_picture: profilePicture,
    })
}

module.exports = {
    followCreator,
    getCreatorById,
    getCreatorProfile,
    updateCreatorProfile
}
