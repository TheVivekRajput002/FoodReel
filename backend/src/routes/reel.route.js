const express = require("express");
const reelController = require("../controllers/reel.controller")
const authMiddleware = require("../middleware/auth.middleware")
const multer = require("multer")

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

router.post("/", authMiddleware.authFoodPartnerMiddleware, upload.single("video"), reelController.createReel)
router.get("/", authMiddleware.authUserMiddleware, reelController.getReel)
router.post("/like", authMiddleware.authUserMiddleware, reelController.likeReel)
router.post("/bookmark", authMiddleware.authUserMiddleware, reelController.bookmarkReel)


module.exports = router;