const foodPartnerModel = require('../models/foodPartner.model')

async function getFoodPartnerById(req, res) {

    const foodPartnerId = req.params.id;

    const FoodPartner = foodPartnerModel.findById(foodPartnerId)

    if (!FoodPartner) {
        return res.status("404").json({ message: "food partner not found" })
    }

    res.status("200").json({
        message: "food partner details received successfully",
        foodPartner,
    })

}

module.exports = {getFoodPartnerById}