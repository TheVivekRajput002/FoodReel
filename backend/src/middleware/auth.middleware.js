const foodPartnerModel = require("../models/foodPartner.model")
const jwt = require("jsonwebtoken")

async function authFoodPartnerMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({
            message: "you are not logged in"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const foodPartner = foodPartnerModel.findById(decoded.id);

        res.foodPartner = foodPartner

        next()

    } catch (error) {
        res.staus(401).json({
            message: "invalid token"
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware
}