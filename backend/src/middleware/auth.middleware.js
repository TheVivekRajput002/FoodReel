const creatorModel = require("../models/creator.model")
const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")

async function authCreatorMiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(400).json({
            message: "you are not logged in"
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const creator = await creatorModel.findById(decoded.id);

        req.creator = creator

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

        if (!user) {
            return res.status(401).json({
                message: "user account not found"
            })
        }

        req.user = user

        next()
    } catch (error) {
        res.status(400).json({
            message: "invalid token"
        })
    }
}

module.exports = {
    authCreatorMiddleware,
    authUserMiddleware
}