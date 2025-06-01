const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const newsController = require("../controllers/news");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/:id", ensureAuth, newsController.getSingleNews);
router.post(
  "/createSingleNews",
  upload.single("file"),
  newsController.createSingleNews
);
router.delete("/deleteNews/:id", newsController.deleteNews);

module.exports = router;
