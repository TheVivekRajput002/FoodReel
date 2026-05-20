const foodPartnerModel = require('../models/foodPartner.model')
const reelModel = require("../models/reel.model")

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const foodPartner = await foodPartnerModel.findById(foodPartnerId)
    const foodItemsByFoodPartner = await reelModel.find({ foodPartner: foodPartnerId })

    if (!foodPartner) {
        return res.status(404).json({ message: "food partner not found" })
    }

    res.status(200).json({
        message: "food partner details received successfully",
        foodPartner: {
            ...foodPartner.toObject(),
            foodItems: foodItemsByFoodPartner,
        }
    })

}

async function getFoodPartnerProfile() {
    const foodPartner = req.foodPartner

    res.status(200).json({
        foodPartner: {
            _id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
            password: foodPartner.password,
        }
    })
}

module.exports = {
    getFoodPartnerById,
    getFoodPartnerProfile
}
