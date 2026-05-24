const mongoose = require("mongoose")
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

const REEL_PAGE_DEFAULT = 10
const REEL_PAGE_MAX = 20

function parseReelPageLimit(raw) {
    const parsed = parseInt(raw, 10)

    if (!Number.isFinite(parsed) || parsed < 1) {
        return REEL_PAGE_DEFAULT
    }

    return Math.min(parsed, REEL_PAGE_MAX)
}

function parseReelFeedCursor(raw) {
    if (!raw || typeof raw !== "string") {
        return []
    }

    try {
        const payload = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"))
        const exclude = payload?.exclude

        if (!Array.isArray(exclude)) {
            return []
        }

        return exclude.filter((id) => mongoose.Types.ObjectId.isValid(id))
    } catch {
        return []
    }
}

function buildReelFeedCursor(excludeIds) {
    return Buffer.from(JSON.stringify({ exclude: excludeIds.map(String) })).toString("base64url")
}

function toUniqueObjectIds(ids) {
    return [...new Set(ids.map(String))]
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id))
}

function rankReelFeed(reels, limit) {
    const scoredReels = reels.map((reel) => {
        let score = (reel.likeCount * 2) + (reel.bookmarkCount * 3)
        const jitter = Math.random() * (score * 0.15)

        score += jitter

        return { ...reel, score }
    })

    scoredReels.sort((a, b) => b.score - a.score)

    const creatorCount = new Map()
    const finalFeed = []

    for (const reel of scoredReels) {
        const creatorId = reel.creator?._id
            ? String(reel.creator._id)
            : null

        if (creatorId) {
            const count = creatorCount.get(creatorId) || 0

            if (count >= 2) {
                continue
            }

            creatorCount.set(creatorId, count + 1)
        }

        finalFeed.push(reel)

        if (finalFeed.length >= limit) {
            break
        }
    }

    return finalFeed
}

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
    try {
        const user = req.user
        const limit = parseReelPageLimit(req.query.limit)
        const cursorExcludeIds = parseReelFeedCursor(req.query.cursor)

        const watchedReels = await watchedReelModel
            .find({ user: user._id })
            .select("reel")

        const watchedReelIds = watchedReels.map((item) => item.reel)
        const excludeIds = toUniqueObjectIds([
            ...watchedReelIds,
            ...cursorExcludeIds,
        ])

        const sampleSize = Math.min(Math.max(limit * 3, 15), 50)
        const candidateReels = await reelModel.aggregate([
            {
                $match: {
                    _id: { $nin: excludeIds },
                },
            },
            {
                $sample: { size: sampleSize },
            },
            {
                $lookup: {
                    from: "creators",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator",
                },
            },
            {
                $unwind: {
                    path: "$creator",
                    preserveNullAndEmptyArrays: true,
                },
            },
        ])

        const page = rankReelFeed(candidateReels, limit)
        const returnedIds = page.map((reel) => String(reel._id))
        const nextExcludeIds = [...new Set([
            ...cursorExcludeIds.map(String),
            ...returnedIds,
        ])]

        const remainingCount = await reelModel.countDocuments({
            _id: { $nin: toUniqueObjectIds([...excludeIds, ...returnedIds]) },
        })

        const hasMore = remainingCount > 0
        const nextCursor = hasMore ? buildReelFeedCursor(nextExcludeIds) : null

        const follows = await followModel
            .find({ user: user._id })
            .select("creator")

        const followedCreatorIds = new Set(
            follows.map((f) => String(f.creator))
        )

        const reelWithFollowState = page.map(({ score, ...reel }) => ({
            ...reel,
            isFollowed: followedCreatorIds.has(String(reel.creator?._id)),
        }))

        res.status(200).json({
            message: "reels fetched successfully",
            reel: reelWithFollowState,
            nextCursor,
            hasMore,
        })
    } catch (error) {
        console.error(error)

        res.status(500).json({
            message: "Something went wrong",
        })
    }
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
