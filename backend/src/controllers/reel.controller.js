const reelModel = require("../models/reel.model")
const likeModel = require("../models/likes.model")
const savedReelModel = require("../models/savedReel.model")
const followModel = require("../models/follow.model")
const { uploadFile } = require("../services/storage.service")
const { v4: uuid } = require("uuid")

async function createReel(req, res) {

    const uploadFileResult = await uploadFile(req.file.buffer, uuid())
    const videoUrl = uploadFileResult.url
    const thumbnailUrl = buildVideoThumbnailUrl(videoUrl, {
        startOffset: 1,
        width: 400,
        height: 400,
    })

    const reel = await reelModel.create({
        name: req.body.name,
        description: req.body.description,
        video: uploadFileResult.url,
        creator: req.creator._id
    })

    res.status(201).json({
        message: "reel created succesfully",
        reel: reel,
    })
}

async function getReel(req, res) {
    const reel = await reelModel.find({});
    const follows = await followModel.find({ user: req.user._id }).select("creator");
    const followedCreatorIds = new Set(follows.map((f) => String(f.creator)));

    const reelWithFollowState = reel.map((r) => {
        const creatorId = String(r.creator);
        return {
            ...r.toObject(),
            isFollowed: followedCreatorIds.has(creatorId)
        };
    });

    res.status(200).json({
        message: "reels fetched successfully",
        reel: reelWithFollowState
    })
}

async function likeReel(req, res) {
    try {
        const { reelId } = req.body
        const user = req.user;
        const isAlreadyLiked = await likeModel.findOne({
            user: user._id,
            reel: reelId
        })

        if (isAlreadyLiked) {
            await likeModel.deleteOne({
                user: req.user._id,
                reel: reelId
            })

            await reelModel.findByIdAndUpdate(reelId, {
                $inc: { likeCount: -1 }
            })

            return res.status(200).json({ message: "reel unliked successfully", like: false })
        }

        await likeModel.create({
            user: req.user._id,
            reel: reelId
        })

        await reelModel.findByIdAndUpdate(reelId, {
            $inc: { likeCount: 1 }
        })

        res.status(200).json({ message: "reel liked successfully", like: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "something went wrong", error: error.message })
    }
}

async function saveReel(req, res) {
    try {

        const { reelId } = req.params
        const user = req.user

        const isAlreadySaved = await savedReelModel.findOne({
            user: user._id,
            reel: reelId
        })

        if (isAlreadySaved) {
            await savedReelModel.deleteOne({
                user: user._id,
                reel: reelId
            })
            await reelModel.findByIdAndUpdate(reelId, {
                $inc: { bookmarkCount: -1 }
            })
            return res.status(200).json({ message: "reel unsaved successfully" })
        }

        const save = await savedReelModel.create({
            user: user._id,
            reel: reelId
        })

        await reelModel.findByIdAndUpdate(reelId, {
            $inc: { bookmarkCount: 1 }
        })

        res.status(201).json({
            message: "reel saved successfully",
            save
        })
    } catch (error) {
        console.log("there is some error in saving unsaving reel", error)
    }


}

async function getSavedReels(req, res) {
    try {

        const userId = req.user._id

        const savedReels = await savedReelModel.find({ user: userId }).populate("reel")

        res.status(200).json({
            success: true,
            savedReels: savedReels
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error
        })
    }
}

module.exports = {
    createReel,
    getReel,
    likeReel,
    saveReel,
    getSavedReels
}
