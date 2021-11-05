const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: [validator.isEmail, "nhap cho dung kieu email di"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
      minlength: 6,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);
