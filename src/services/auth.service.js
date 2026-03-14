const User = require("../models/user.model");
const BlacklistToken = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createLogger = require("../utils/logger");
const authLogger = createLogger("auth");

const { MESSAGES, ACCOUNT_STATUS, ROLES } = require("../constants/constant");

/* ================= REGISTER USER ================= */

const registerUser = async (data = {}) => {
  authLogger.info("Registering user", data);
  const { username, first_name, last_name, email, phone_no, password, role } =
    data;

  if (!password) {
    authLogger.error("Password is required");
    throw new Error(MESSAGES.AUTH.PASSWORD_REQUIRED);
  }

  /* Check existing user */

  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  authLogger.info("Existing user found", existingUser);

  if (existingUser) {
    authLogger.error("User already exists", existingUser);
    if (existingUser.email === email) {
      authLogger.error("Email already exists", existingUser.email);
      throw new Error(MESSAGES.AUTH.EMAIL_ALREADY_EXISTS);
    }

    if (existingUser.username === username) {
      authLogger.error("Username already exists", existingUser.username);
      throw new Error(MESSAGES.AUTH.USERNAME_ALREADY_EXISTS);
    }
  }

  /* Hash password */

  const hashedPassword = await bcrypt.hash(password, 10);
  authLogger.info("Password hashed successfully", hashedPassword);

  /* Create user */
  authLogger.info("Creating user", data);
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
  authLogger.info("User created successfully", user);

  /* Remove password before returning */

  const userObject = user.toObject();
  authLogger.info("Password removed from user object", userObject);
  delete userObject.password;
  authLogger.info("User object returned", userObject);

  return userObject;
};

/* ================= LOGIN USER ================= */

const loginUser = async (username, password) => {
  authLogger.info("Logging in user", username);

  const user = await User.findOne({ username });
  authLogger.info("User found", user);

  if (!user) {
    authLogger.error("User not found", username);
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  if (user.is_active !== ACCOUNT_STATUS.ACTIVE) {
    authLogger.error("Account is inactive", user);
    throw new Error(MESSAGES.AUTH.ACCOUNT_INACTIVE);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  authLogger.info("Password matched", isMatch);

  if (!isMatch) {
    authLogger.error("Invalid credentials", username);
    throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
  }

  const userObject = user.toObject();
  authLogger.info("Password removed from user object", userObject);
  delete userObject.password;
  authLogger.info("User object returned", userObject);

  return userObject;
};

/* ================= LOGOUT USER ================= */

const logoutUser = async (token) => {
  authLogger.info("Logging out user", token);

  if (!token) {
    authLogger.error("Token is required", token);
    throw new Error(MESSAGES.AUTH.TOKEN_REQUIRED);
  }

  const decoded = jwt.decode(token);
  authLogger.info("Token decoded", decoded);

  if (!decoded) {
    authLogger.error("Invalid token", token);
    throw new Error(MESSAGES.AUTH.INVALID_TOKEN);
  }

  await BlacklistToken.create({
    token,
    expires_at: new Date(decoded.exp * 1000),
  });
  authLogger.info("Token added to blacklist", token);

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
