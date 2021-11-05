const jwt = require("jsonwebtoken");
const User = require("../model/User");
module.exports.protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(400).json({ msg: "no token" });
    }
    const decoded = jwt.verify(token, process.env.secret);
    const user = await User.findById(decoded.id);

    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ msg: "token is no valid" });
  }
};
