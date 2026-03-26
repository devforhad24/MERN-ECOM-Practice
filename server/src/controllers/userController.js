const createError = require("http-errors");

// fetch users
const getUsers = (req, res, next) => {
  try {
    res.status(200).send({
      message: "Users retrieved successfully!"
    });
  } catch (error) {
    next(error);
  }
}; // end method

module.exports = { getUsers };
