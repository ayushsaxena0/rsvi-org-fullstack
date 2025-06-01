const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");

//Main Routes - simplified for now
router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);

module.exports = router;
