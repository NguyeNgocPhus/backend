const Post = require("../model/Post");
const Profile = require("../model/Profile");
const User = require("../model/User");

// @router POST api/posts
// @decs create post
// @access private
module.exports.createPost = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    const newPost = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    };
    const post = await Post.create(newPost);
    res.status(400).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @router GET api/posts
// @decs get all post
// @access private
module.exports.getAllPosts = async (req, res, next) => {
  try {
    const post = await Post.find();
    res.status(400).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @router GET api/post/:id
// @decs get  post by ID
// @access private
module.exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("id not invalid");
    }
    res.status(400).send(post);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).send("post is not found");
    }
    res.status(400).send(error.message);
  }
};

// @router DELETE api/post/:id
// @decs  delete post by ID
// @access private
module.exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await post.remove();
    res.status(400).send({ msg: "remove success" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).send("post is not found");
    }
    res.status(400).send(error.message);
  }
};

// @router PUT api/post/like/:id
// @decs Like a post
// @access private
module.exports.likePost = async (req, res, next) => {
  var postId = req.params.id;
  var userId = req.user._id;
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("dmmmmmmmmmmmmmmmmmmm");
    }

    if (
      post.likes.filter((like) => like.user.toString() !== req.user._id)
        .length > 0
    ) {
      throw new Error("Post already liked");
    }

    post.likes.push({ user: req.user._id });
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @router PUT api/post/like/:id
// @decs UnLike a post
// @access private
module.exports.UnlikePost = async (req, res, next) => {
  var postId = req.params.id;
  var userId = req.user._id;
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      throw new Error("dmmmmmmmmmmmmmmmmmmm");
    }
    // console.log(post, req.user._id);
    if (
      post.likes.filter(
        (like) => like.user.toString() === req.user._id.toString()
      ).length === 0
    ) {
      throw new Error("Post has not yet been liked");
    }
    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user._id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @router POST api/post/comment/:id
// @decs create comment a post
// @access private
module.exports.createComment = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-password");
    const post = await Post.findById(postId);

    if (!post || !user) {
      throw new Error("dmmmmmmmmmmmmmmmmmmm");
    }
    const newComment = {
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user._id,
    };
    post.comments.push(newComment);

    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

// @router DELETE api/post/comment/:id/:comment_id
// @decs delete comment a post
// @access private
module.exports.deleteComment = async (req, res, next) => {
  const postId = req.params.id;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("dmmmmmmmmmmmmmmmmmmm");
    }
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.comment_id
    );

    if (!comment) {
      throw new Error("comment is not existing");
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      throw new Error("User not authorized");
    }

    const removeIndex = post.comments
      .map((comment) => comment._id)
      .indexOf(req.params.id);
    post.comments.splice(removeIndex, 1);
    await post.save();
    res.status(200).send(post);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
