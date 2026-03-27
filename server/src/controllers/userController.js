const createError = require("http-errors");
const fs = require("fs");

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");

// fetch users
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const searchRegEXP = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegEXP } },
        { email: { $regex: searchRegEXP } },
        { phone: { $regex: searchRegEXP } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) throw createError(404, "No users found");

    return successResponse(res, {
      statusCode: 200,
      message: "Users were returned successfully",
      payload: {
        users,
        pagination: {
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}; // end method

// fetch user by id
const getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "Users was returned successfully",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
}; // end method

// delete user by id
const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(id, options);

    const userImagePath = user.image;
    fs.access(userImagePath, (err) => {
      if (err) {
        console.error("User image does not exists");
      } else {
        fs.unlink(userImagePath, (err) => {
          if (err) throw err;
          console.log("User image was deleted");
        });
      }
    });

    await User.findByIdAndDelete({_id:id, isAdmin: false});

    return successResponse(res, {
      statusCode: 200,
      message: "Users was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}; // end method

module.exports = { getUsers, getUser, deleteUser };
