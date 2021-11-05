const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const checkValidator = require("../middleware/validator");
router.post("/api/users", checkValidator, userController.createUser);
module.exports = router;
