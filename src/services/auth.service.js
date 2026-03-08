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

  const existingEmail = await User.findOne({ email });

  if (existingEmail) {
    throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
  }

  const existingUsername = await User.findOne({ username });

  if (existingUsername) {
    throw new Error(MESSAGES.AUTH.USERNAME_ALREADY_EXISTS);
  }

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

  return user;
};

/* ================= LOGIN USER ================= */

const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  if (!user.is_active) {
    throw new Error(MESSAGES.AUTH.ACCOUNT_INACTIVE);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  return user;
};

const logoutUser = async (token) => {
  if (!token) {
    throw new Error(MESSAGES.AUTH.TOKEN_REQUIRED);
  }

  const decoded = jwt.decode(token);

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
