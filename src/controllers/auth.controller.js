const authService = require("../services/auth.service");
const generateToken = require("../utils/generateToken");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= REGISTER ================= */

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

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
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    const { username, password } = req.body || {};

    const user = await authService.loginUser(username, password);

    const token = generateToken(user);

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
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

module.exports = {
  register,
  login,
};
