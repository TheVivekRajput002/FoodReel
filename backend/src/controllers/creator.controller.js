const creatorModel = require('../models/creator.model')
const userModel = require('../models/user.model')
const reelModel = require("../models/reel.model")
const followModel = require("../models/follow.model")

async function getCreatorById(req, res) {

    const creatorId = req.params.id;

    const creator = await creatorModel.findById(creatorId)
    const foodItemsByCreator = await reelModel.find({ creator: creatorId })

    if (!creator) {
        return res.status(404).json({ message: "food partner not found" })
    }

    res.status(200).json({
        message: "food partner details received successfully",
        creator: {
            ...creator.toObject(),
            foodItems: foodItemsByCreator,
        }
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
        return res.json({ success: true, action: "unfollowed" });

    } else {

        await followModel.create({ user: userId, creator: creatorId });
        await userModel.findByIdAndUpdate(userId, { $inc: { followingCount: +1 } })
        return res.json({ success: true, action: "followed" });
    }
}

module.exports = {
    followCreator,
    getCreatorById,
    getCreatorProfile
}
