const foodModel = require("../models/food.model")
const { uploadFile } = require("../services/storage.service")
const { v4: uuid } = require("uuid")

async function createFood(req, res) {

    const uploadFileResult = await uploadFile(req.file.buffer, uuid())
    console.log(uploadFileResult)
    res.send("food item created")

    console.log(req.foodPartner)
    console.log(req.body)
    console.log(req.file)
    res.send("food item created")
}

module.exports = {
    createFood
}