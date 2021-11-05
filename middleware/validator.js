const validator = require("validator");
const { check, validationResult } = require("express-validator");
const checkValidator = (req, res, next) => {
  const a = check(req.body.name, "Name is required").notEmpty();
  check("email", "Please include a valid email").isEmail();
  check(
    "password",
    "Please enter a password with 6 or more characters"
  ).isLength({ min: 6 });
  const errors = validationResult(req);

  next();
};
module.exports = checkValidator;
