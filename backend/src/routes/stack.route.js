const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const stackController = require("../controllers/stack.controller")

const router = express.Router();

router.post("/create", authMiddleware.authCreatorMiddleware, stackController.createStack);
router.get("/", stackController.getStacks);
router.get("/:id", stackController.getStackDetail);

module.exports = router;
