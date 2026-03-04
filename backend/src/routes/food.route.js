const express = require("express");
const foodController = require("../controllers/food.controller")
const authMiddleware = require("../middleware/auth.middleware")
const multer = require("multer")

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage(),
});

router.post("/", authMiddleware.authFoodPartnerMiddleware, upload.single("video"), foodController.createFood)
router.get("/", authMiddleware.authUserMiddleware, foodController.getFoodItems)
router.post("/like", authMiddleware.authUserMiddleware, foodController.likeFood)
router.post("/bookmark", authMiddleware.authUserMiddleware, foodController.bookmarkFood)


module.exports = router;