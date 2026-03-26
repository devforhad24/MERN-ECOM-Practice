const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const { defaultImagePath } = require("../secret");

// create schema for user
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User email is required"],
      trim: true,
      minLength: [3, "The length of user name can be minimum 3 characters"],
      maxLength: [31, "The length of user name can be minimum 31 characters"],
    },
    email: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        validator: (v) => {
          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minLength: [6, "The length of user password can be minimum 6 characters"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    address: {
      type: String,
      required: [true, "User address is required"],
    },
    phone: {
      type: String,
      required: [true, "User phone is required"],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// create model for user
const User = model("users", userSchema)

module.exports = User;
