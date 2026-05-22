const badgeModel = require("../models/badge.model")
const userBadgeModel = require("../models/userBadge.model")

async function completeBadge(req, res) {

    try {
        const badgeId = req.params.id
        const user = req.user

        const userBadge = await userBadgeModel.create({
            userId: user._id,
            badgeId: badgeId
        })

        res.status(200).json({
            success: true,
            userBadge
        })

    } catch (error) {
        if (error?.code === 11000) {
            return res.status(200).json({
                success: true,
                message: "Badge already completed"
            })
        }

        res.status(400).json({
            success: false,
            error
        })

    }
}

async function getBadges(req,res){
    try {
        const user = req.user
        const badges = await badgeModel.find().lean()
        const userBadges = await userBadgeModel
            .find({ userId: user._id })
            .select("badgeId")
            .lean()

        const completedIds = new Set(
            userBadges.map((userBadge) => userBadge.badgeId.toString())
        )

        const badgesWithStatus = badges.map((badge) => ({
            ...badge,
            completed: completedIds.has(badge._id.toString())
        }))

        res.status(200).json({
            success: true,
            badges: badgesWithStatus
        })
    } catch (error) {
        res.status(404).json({
            success: false,
            error
        })
        
    }
}

module.exports = {
    completeBadge,
    getBadges
}