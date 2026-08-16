const User = require("../models/user.model");
const BlacklistToken = require("../models/blacklistToken.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const createLogger = require("../utils/logger");
const authLogger = createLogger("auth");

const { MESSAGES, ACCOUNT_STATUS, ROLES } = require("../constants/constant");
const { plugin } = require("mongoose");
const sendEmail = require("../utils/sendMail");
const buildResetPasswordTemplate = require("../templates/resetPassword.template");
const buildWelcomeTemplate = require("../templates/welcomeEmail.template");
const crypto = require("crypto");

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
    is_active: 1,
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

  const welcomeTemplate = buildWelcomeTemplate(user.username);
  await sendEmail(user.email, "Welcome to Royal Cafe", welcomeTemplate);
  user.welcome_email_sent = true;
  user.welcome_email_sent_at = new Date();
  await user.save();
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

/* ================= RESET PASSWORD ================= */
const resetPassword = async (userId, old_password, new_password) => {
  if (!new_password) {
    throw new Error(MESSAGES.AUTH.NEW_PASSWORD_REQUIRED);
  }
  const user = await User.findById(userId);
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const isMatch = await bcrypt.compare(old_password, user.password);
  if (!isMatch) {
    throw new Error(MESSAGES.AUTH.OLD_PASSWORD_INCORRECT);
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);
  user.password = hashedPassword;
  await user.save();

  return true;
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(MESSAGES.USER.NOT_FOUND);
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.reset_password_token = resetToken;
  user.reset_password_expires = Date.now() + 15 * 60 * 1000;

  await user.save();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetLink = `${frontendUrl}/reset-password?token=${resetToken}`;
  const html = buildResetPasswordTemplate(resetLink, user.username);

  await sendEmail(user.email, "Reset Your Royal Cafe Password", html);

  return true;
};

/* ================= CONFIRM RESET PASSWORD WITH TOKEN ================= */
const resetPasswordWithToken = async (token, new_password) => {
  if (!token || !new_password) {
    throw new Error("Token and new password are required");
  }

  const user = await User.findOne({
    reset_password_token: token,
    reset_password_expires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error("Invalid or expired password reset link. Please request a new link.");
  }

  const hashedPassword = await bcrypt.hash(new_password, 10);
  user.password = hashedPassword;
  user.reset_password_token = null;
  user.reset_password_expires = null;
  await user.save();

  return true;
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  forgotPassword,
  resetPasswordWithToken,
};
