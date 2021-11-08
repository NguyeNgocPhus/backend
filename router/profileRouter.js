const express = require("express");
const router = express.Router();
const profileController = require("../controller/profileController");
const { protect } = require("../middleware/auth");

router.get("/api/profile/me", protect, profileController.me);
router.post("/api/profile", protect, profileController.createProfile);
router.get("/api/profile", profileController.getAllProfile);
router.get("/api/profile/user/:user_id", profileController.getProfile);
router.get("/api/profile/github/:username", profileController.getGitHubRepos);
router.delete(
  "/api/profile/user/:user_id",
  protect,
  profileController.deleteProfile
);
router.put("/api/profile/experience", protect, profileController.addExperience);
router.delete(
  "/api/profile/experience/:exp_id",
  protect,
  profileController.deleleExperience
);
router.put("/api/profile/education", protect, profileController.addEducation);
router.delete(
  "/api/profile/education/:edu_id",
  protect,
  profileController.deleteEducation
);
module.exports = router;
