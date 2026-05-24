const reelModel = require("../models/reel.model")
const likeModel = require("../models/likes.model")
const savedReelModel = require("../models/savedReel.model")
const followModel = require("../models/follow.model")
const watchedReelModel = require("../models/watchedReel.model")
const { uploadFile, createVideoThumbnail } = require("../services/storage.service")
const {
    checkAchievements,
    recordReelWatch,
} = require("../services/achievement.service")
const { v4: uuid } = require("uuid")

async function createReel(req, res) {
    const assetId = uuid()
    const thumbnailId = uuid()
    const thumbnailBuffer = await createVideoThumbnail(req.file.buffer, thumbnailId, {
        startOffset: 1,
        width: 400,
        height: 400,
    })

    const uploadFileResult = await uploadFile(req.file.buffer, assetId)
    const thumbnailUploadResult = await uploadFile(thumbnailBuffer, `${thumbnailId}.jpg`)
    const videoUrl = uploadFileResult.url

    const reel = await reelModel.create({
        name: req.body.name,
        description: req.body.description,
        video: videoUrl,
        creator: req.creator._id,
        thumbnail: thumbnailUploadResult.url
    })

    res.status(201).json({
        message: "reel created succesfully",
        reel: reel,
    })
}

async function getReel(req, res) {
    const user = req.user

    //  get watched reels by user 
    const watchedReels = await watchedReelModel.find({ user: user._id })
    const watchedReelIds = watchedReels.map((watchedReel) => watchedReel.reel)

    const reel = await reelModel.find({
        _id: { $nin: watchedReelIds }
    }).populate("creator");

    const follows = await followModel.find({ user: req.user._id }).select("creator");
    const followedCreatorIds = new Set(follows.map((f) => String(f.creator)));


    const reelWithFollowState = reel.map((r) => {
        const creatorId = String(r.creator?._id ?? r.creator);
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

        const unlocked = await checkAchievements(user._id, "REEL_SAVED")

        res.status(201).json({
            message: "reel saved successfully",
            save,
            unlockedBadges: unlocked.map((entry) => entry.badge),
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

async function watchReel(req, res) {
    try {
        const { reelId } = req.params
        const userId = req.user._id

        await recordReelWatch(userId, reelId)

        const unlocked = await checkAchievements(userId, "REEL_WATCHED")

        res.status(200).json({
            success: true,
            unlockedBadges: unlocked.map((entry) => entry.badge),
        })
    } catch (error) {
        console.error("error recording reel watch", error)
        res.status(500).json({
            success: false,
            message: "something went wrong",
        })
    }
}



module.exports = {
    createReel,
    getReel,
    likeReel,
    saveReel,
    getSavedReels,
    watchReel,
}
