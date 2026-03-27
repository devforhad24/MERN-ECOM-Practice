const createError = require("http-errors");
const fs = require("fs").promises;

const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const { deleteImage } = require("../helper/deleteImage");

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
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

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
const deleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findWithId(User, id, options);

    const userImagePath = user.image;

    deleteImage(userImagePath);

    await User.findByIdAndDelete({ _id: id, isAdmin: false });

    return successResponse(res, {
      statusCode: 200,
      message: "Users was deleted successfully",
    });
  } catch (error) {
    next(error);
  }
}; // end method

// processRegister
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body || {};

    const userExists = await User.exists({ email: email });
    if (userExists) {
      throw createError(409, "This email already registerd! please login");
    }

    const newUser = {
      name,
      email,
      password,
      phone,
      address,
    };

    return successResponse(res, {
      statusCode: 200,
      message: "Users was created successfully",
      payload: { newUser },
    });
  } catch (error) {
    next(error);
  }
}; // end method

module.exports = { getUsers, getUserById, deleteUserById, processRegister };
