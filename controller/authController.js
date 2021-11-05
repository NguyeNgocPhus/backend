const User = require("../model/User");
const jwt = require("jsonwebtoken");
// @router GET api/auth
// @decs get user by token
// @access public
module.exports.auth = async (req, res, next) => {
  if (req.user) {
    return res.status(200).json(req.user);
  }
  res.status(400).json("eee");
};

// @router Post api/login
// @decs login user
// @access public
module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new Error(`Vui lòng nhập email và mật khẩu`, 400);
    }

    // Find user
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      throw new Error(`Không tồn tại tài khoản`, 401);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new Error(`Sai mật khẩu`, 401);
    }
    const payload = {
      id: user._id,
    };
    const token = await jwt.sign(payload, process.env.secret, {
      expiresIn: 1000 * 60 * 60 * 24,
    });
    res.json({
      token,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
};
