const User = require("../models/user.model");

const { MESSAGES } = require("../constants/constant");

/* ================= GET ALL USERS ================= */

const getAllUsers = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    username,
    first_name,
    last_name,
    email,
    phone_no,
    gender,
  } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {
    is_active: true,
    role: "user",
  };

  /* ================= USERNAME SEARCH ================= */
  if (username) {
    filter.username = { $regex: username, $options: "i" };
  }

  /* ================= FIRST NAME ================= */
  if (first_name) {
    filter.first_name = { $regex: first_name, $options: "i" };
  }

  /* ================= LAST NAME ================= */
  if (last_name) {
    filter.last_name = { $regex: last_name, $options: "i" };
  }

  /* ================= EMAIL ================= */
  if (email) {
    filter.email = { $regex: email, $options: "i" };
  }

  /* ================= PHONE ================= */
  if (phone_no) {
    filter.phone_no = { $regex: phone_no, $options: "i" };
  }

  /* ================= GENDER ================= */
  if (gender) {
    filter.gender = gender;
  }

  /* ================= FETCH ================= */
  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),

    User.countDocuments(filter),
  ]);

  return {
    data: users,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET USER BY ID ================= */

const getUserById = async (id) => {
  const user = await User.findOne({
    _id: id,
    is_active: true,
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
      is_active: true,
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
