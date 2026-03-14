const authService = require("../services/auth.service");
const generateToken = require("../utils/generateToken");
const { sendResponse } = require("../utils/response");
const createLogger = require("../utils/logger");
const authLogger = createLogger("auth");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= REGISTER ================= */

const register = async (req, res) => {
  try {
    authLogger.info("Registering API called")
    const user = await authService.registerUser(req.body);
    authLogger.info("User registered successfully", user.username)
    const token = generateToken(user);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
      data: {
        user,
        token,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    authLogger.error("Error registering user", error)
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    authLogger.info("Login API called")
    const { username, password } = req.body;
    const user = await authService.loginUser(username, password);
    authLogger.info("User logged in successfully", user.username)
    const token = generateToken(user);
    authLogger.info("Token generated successfully", token)

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      data: {
        user,
        token,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    authLogger.error("Error logging in user", error)
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.UNAUTHORIZED,
    });
  }
};

/* ================= LOGOUT ================= */

const logout = async (req, res) => {
  try {
    authLogger.info("Logout API called")
    const authHeader = req.headers.authorization;
    authLogger.info("Authorization header received", authHeader)

    if (!authHeader) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.AUTH.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(" ")[1];
    authLogger.info("Token received", token)

    await authService.logoutUser(token);
    authLogger.info("User logged out successfully")

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      data: null,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    authLogger.error("Error logging out user", error)
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.SERVER_ERROR,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
};
