const User = require("../models/user.model");

const { MESSAGES } = require("../constants/constant");

/* ================= GET ALL USERS ================= */

const getAllUsers = async () => {
  const users = await User.find({
    deleted_at: null,
  }).select("-password");

  return users;
};

/* ================= GET USER BY ID ================= */

const getUserById = async (id) => {
  const user = await User.findOne({
    _id: id,
    deleted_at: null,
  }).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

/* ================= UPDATE USER ================= */

const updateUser = async (id, data = {}) => {
  const user = await User.findOneAndUpdate(
    {
      _id: id,
      deleted_at: null,
    },
    data,
    { new: true },
  ).select("-password");

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return user;
};

/* ================= DELETE USER (SOFT DELETE) ================= */

const deleteUser = async (id) => {
  const user = await User.findOneAndUpdate(
    { _id: id },
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );

  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  return true;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
