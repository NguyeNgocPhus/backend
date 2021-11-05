const express = require("express");
const router = express.Router();
const authController = require("../controller/authController");
const { protect } = require("../middleware/auth");
router.post("/api/login", authController.login);
router.get("/api/auth", protect, authController.auth);

module.exports = router;
