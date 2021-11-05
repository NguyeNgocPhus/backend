const User = require("../model/User");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

// @router Post api/users
// @decs Create user
// @access public
module.exports.createUser = async (req, res, next) => {
  const errors = validationResult(req);
  //console.log(errors);
  try {
    const { name, password, email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: [{ msg: "User already exists" }] });
    }
    const avatar = gravatar.url(email, {
      s: "200",
      r: "pg",
      d: "mm",
    });
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      avatar,
      email,
      password: hashPassword,
    });
    const payload = {
      id: user._id,
    };
    const token = await jwt.sign(payload, process.env.secret, {
      expiresIn: 1000 * 60 * 60 * 24,
    });
    res.status(200).json({
      token,
    });
  } catch (error) {
    console.log(error._message);
    return res.status(401).send(error._message);
  }
};
