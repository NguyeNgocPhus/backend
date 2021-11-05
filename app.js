const express = require("express");
const route = require("./router/index");
require("dotenv").config({ path: "./config/.env" });
const app = express();

app.use(express.json());
route(app);
module.exports = app;
