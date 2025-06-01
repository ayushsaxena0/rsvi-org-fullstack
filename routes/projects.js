const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const projectController = require("../controllers/projects");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/:id", ensureAuth, projectController.getProject);
router.post(
  "/createProject",
  upload.single("file"),
  projectController.createProject
);
router.delete("/deleteProject/:id", projectController.deleteProject);

module.exports = router;
