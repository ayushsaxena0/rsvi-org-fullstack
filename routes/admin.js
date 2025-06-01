const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");
const adminController = require("../controllers/admin");
const newsController = require("../controllers/news");
const storiesController = require("../controllers/stories");
const projectsController = require("../controllers/projects");
const eventsController = require("../controllers/events");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Main Routes - simplified for now
router.get("/", ensureAuth, adminController.getDashboard);
router.get("/news", ensureAuth, newsController.getNews);
router.get("/stories", ensureAuth, storiesController.getStories);
router.get("/projects", ensureAuth, projectsController.getProjects);
router.get("/events", ensureAuth, eventsController.getEvents);
router.get("/logout", authController.logout);

module.exports = router;
