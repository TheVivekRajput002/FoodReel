const foodPartnerModel = require("../models/foodPartner.model")
const userModel = require("../models/user.model")
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
        const foodPartner = await foodPartnerModel.findById(decoded.id);

        req.foodPartner = foodPartner

        next()

    } catch (error) {
        res.status(401).json({
            message: "invalid token"
        })
    }
}

async function authUserMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({
            message: "you are not logged in"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.id)

        req.user = user

        next()
    } catch (error) {
        res.status(400).json({
            message: "invalid token"
        })
    }
}

module.exports = {
    authFoodPartnerMiddleware,
    authUserMiddleware
}