const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

/* Register User */
const registerUser = async (data = {}) => {
  const { username, first_name, last_name, email, phone_no, password, role } =
    data;

  /* Check required fields */
  if (!password) {
    throw new Error("Password is required");
  }

  /* Check if email already exists */
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new Error("Email already registered");
  }

  /* Check username */
  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new Error("Username already taken");
  }

  /* Hash Password */
  const hashedPassword = await bcrypt.hash(password, 10);

  /* Create User */
  const user = await User.create({
    username,
    first_name,
    last_name,
    email,
    phone_no,
    password: hashedPassword,
    role: role || "user",
  });

  return user;
};

/* Login User */
const loginUser = async (username, password) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Invalid username or password");
  }

  if (!user.is_active) {
    throw new Error("Account is inactive");
  }

  /* Compare Password */
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid username or password");
  }

  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
