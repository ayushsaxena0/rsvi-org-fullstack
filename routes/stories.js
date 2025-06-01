const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const storyController = require("../controllers/stories");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/:id", ensureAuth, storyController.getStory);
router.post("/createStory", upload.single("file"), storyController.createStory);
router.delete("/deleteStory/:id", storyController.deleteStory);

module.exports = router;
