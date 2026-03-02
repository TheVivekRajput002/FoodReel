const foodModel = require("../models/food.model")
const likeModel = require("../models/likes.model")
const saveModel = require("../models/save.model")
const { uploadFile } = require("../services/storage.service")
const { v4: uuid } = require("uuid")

async function createFood(req, res) {

    const uploadFileResult = await uploadFile(req.file.buffer, uuid())

    const foodItem = await foodModel.create({
        name: req.body.name,
        description: req.body.description,
        video: uploadFileResult.url,
        foodPartner: req.foodPartner._id
    })

    res.status(201).json({
        message: "food item created succesfully",
        foodItem: foodItem,
    })
}

async function getFoodItems(req, res) {
    const foodItems = await foodModel.find({});
    res.status(200).json({
        message: "food items fetched successfully",
        foodItems
    })
}

async function likeFood(req, res) {
    const { foodId } = req.body

    const user = req.user;
    const isAlreadyLiked = await likeModel.findOne({
        user: user._id,
        food: foodId
    })

    if (isAlreadyLiked) {
        await likeModel.deleteOne({
            user: req.user._id,
            food: foodId
        })

        await foodModel.findByIdAndUpdate(foodId, {
            $inc: { likeCount: -1 }
        })

        return res.status(201).json({ message: "reel unliked succesfully" })
    }

    const like = await likeModel.create({
        user: req.user._id,
        food: foodId
    })

    await foodModel.findByIdAndUpdate(foodId, {
        $inc: { likeCount: -1 }
    })

    res.status(201).json({ message: "reel liked successfully" })
}

async function saveFood(req, res) {
    const { foodId } = req.body
    const user = req.user

    const isAlreadySaved = await saveModel.findOne({
        user: user._id,
        food: foodId
    })

    if (!isAlreadySaved) {
        await saveModel.deleteOne({
            user: user._id,
            food: foodId
        })
        return res.status(201).json({ message: "food unsaved successfully" })
    }

    const save = await saveModel.create({
        user: user._id,
        food: foodId
    })

    res.status(201).json({
        message: "food saved successfully",
        save
    })

}

module.exports = {
    createFood,
    getFoodItems,
    likeFood,
    saveFood
}