const foodModel = require("../models/food.model")
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

async function getFoodItems(req,res){
    const foodItems = await foodModel.find({});
    res.status(200).json({
        message:"food items fetched successfully",
        foodItems
    })
}

module.exports = {
    createFood,
    getFoodItems
}