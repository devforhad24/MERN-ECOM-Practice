const createError = require("http-errors");
const users = require("../models/userModel");

// fetch users
const getUsers = (req, res, next) => {
  try {
    res.status(200).send({
      message: "Users retrieved successfully!",
      users,
    });
  } catch (error) {
    next(error);
  }
}; // end method

module.exports = { getUsers };
