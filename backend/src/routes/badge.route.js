const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const badgeController = require("../controllers/badge.controller")

const router = express.Router()

router.post("/:id/completeBadge", authMiddleware.authUserMiddleware , badgeController.completeBadge)
router.get("/", authMiddleware.authUserMiddleware , badgeController.getBadges)

module.exports = router