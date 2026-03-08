const authService = require("../services/auth.service");
const generateToken = require("../utils/generateToken");
const { sendResponse } = require("../utils/response");

const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

const {
  registerValidation,
  loginValidation,
} = require("../validations/user.validation");

/* ================= REGISTER ================= */

const register = async (req, res) => {
  try {
    const { error } = registerValidation.validate(req.body);

    if (error) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: error.details[0].message,
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    }

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
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= LOGIN ================= */

const login = async (req, res) => {
  try {
    const { error } = loginValidation.validate(req.body);

    if (error) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: error.details[0].message,
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    }

    const { username, password } = req.body;

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
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.UNAUTHORIZED,
    });
  }
};

/* ================= LOGOUT ================= */

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.AUTH.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(" ")[1];

    await authService.logoutUser(token);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.AUTH.LOGOUT_SUCCESS,
      data: null,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
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
