const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const eventController = require("../controllers/events");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/:id", ensureAuth, eventController.getEvent);
router.post("/createEvent", upload.single("file"), eventController.createEvent);
router.delete("/deleteEvent/:id", eventController.deleteEvent);

module.exports = router;
