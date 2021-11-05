const express = require("express");
const router = express.Router();
const UserRouter = require("./userRouter");
const AuthRouter = require("./authRouter");
const PostRouter = require("./postRouter");
const ProfileRouter = require("./profileRouter");
const routers = [UserRouter, AuthRouter, ProfileRouter, PostRouter];
module.exports = (app) => {
  routers.forEach((route) => {
    app.use("/", route);
  });
};
