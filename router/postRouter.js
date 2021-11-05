const express = require("express");
const router = express.Router();
const postController = require("../controller/postController");
const { protect } = require("../middleware/auth");
router.post("/api/posts", protect, postController.createPost);
router.get("/api/posts", protect, postController.getAllPosts);
router.get("/api/post/:id", protect, postController.getPost);
router.delete("/api/post/:id", protect, postController.deletePost);
router.put("/api/post/like/:id", protect, postController.likePost);
router.put("/api/post/unlike/:id", protect, postController.UnlikePost);
router.post("/api/post/comment/:id", protect, postController.createComment);
router.delete(
  "/api/post/comment/:id/:comment_id",
  protect,
  postController.deleteComment
);

module.exports = router;
