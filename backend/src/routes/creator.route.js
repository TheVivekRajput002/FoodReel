const express = require("express")
const authMiddleware = require("../middleware/auth.middleware")
const creatorController = require("../controllers/creator.controller")

const router = express.Router()

router.get("/:id",authMiddleware.authUserMiddleware, creatorController.getCreatorById  )
router.post("/:id/follow",authMiddleware.authUserMiddleware,  creatorController.followCreator  )

router.get("/profile",authMiddleware.authCreatorMiddleware, creatorController.getCreatorProfile  )
module.exports = router;