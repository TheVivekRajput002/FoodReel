const reelModel = require("../models/reel.model")
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { uploadFile } = require("../services/storage.service")
const { v4: uuid } = require("uuid")

async function createReel(req, res) {

    const uploadFileResult = await uploadFile(req.file.buffer, uuid())

    const reel = await reelModel.create({
        name: req.body.name,
        description: req.body.description,
        video: uploadFileResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "reel created succesfully",
        reel: reel,
    })
}

async function getReel(req, res) {
    const reel = await reelModel.find({});
    res.status(200).json({
        message: "reels fetched successfully",
        reel
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

async function bookmarkReel(req, res) {
    const { reelId } = req.body
    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        reel: reelId
    })

    if (isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            reel: reelId
        })
        await saveModel.findByIdAndUpdate(reelId, {
            $inc: { bookmarkCount: -1 }
        })
        return res.status(201).json({ message: "reel unsaved successfully" })
    }

    const save = await saveModel.create({
        user: user._id,
        reel: reelId
    })

    await saveModel.findByIdAndUpdate(reelId, {
        $inc: { bookmarkCount: 1 }
    })

    res.status(201).json({
        message: "reel saved successfully",
        save
    })

}

module.exports = {
    createReel,
    getReel,
    likeReel,
    bookmarkReel
}
