const User = require("../models/user.model");
const BlacklistToken = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { MESSAGES, ACCOUNT_STATUS, ROLES } = require("../constants/constant");

/* ================= REGISTER USER ================= */

const registerUser = async (data = {}) => {
  const { username, first_name, last_name, email, phone_no, password, role } =
    data;

  if (!password) {
    throw new Error(MESSAGES.AUTH.PASSWORD_REQUIRED);
  }

  /* Check existing user */

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    if (existingUser.email === email) {
      throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    if (existingUser.username === username) {
      throw new Error(MESSAGES.AUTH.USERNAME_ALREADY_EXISTS);
    }
  }

  /* Hash password */

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    first_name,
    last_name,
    email,
    phone_no,
    password: hashedPassword,
    role: role || ROLES.USER,
    is_active: ACCOUNT_STATUS.ACTIVE,
  });

  /* Remove password before returning */

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

/* ================= LOGIN USER ================= */

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  if (user.is_active !== ACCOUNT_STATUS.ACTIVE) {
    throw new Error(MESSAGES.AUTH.ACCOUNT_INACTIVE);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

/* ================= LOGOUT USER ================= */

const logoutUser = async (token) => {
  if (!token) {
    throw new Error(MESSAGES.AUTH.TOKEN_REQUIRED);
  }

  const decoded = jwt.decode(token);

  if (!decoded) {
    throw new Error(MESSAGES.AUTH.INVALID_TOKEN);
  }

  await BlacklistToken.create({
    token,
    expires_at: new Date(decoded.exp * 1000),
  });

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
