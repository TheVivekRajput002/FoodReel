const express = require("express")
const multer = require("multer")
const authMiddleware = require("../middleware/auth.middleware")
const userController = require("../controllers/user.controller")


const upload = multer({
    storage: multer.memoryStorage(),
});

const router = express.Router();

router.post('/profile-picture', authMiddleware.authUserMiddleware, upload.single("image"), userController.updateUserProfile)
router.post('/bio', authMiddleware.authUserMiddleware, userController.updateUserBio)

module.exports = router;
