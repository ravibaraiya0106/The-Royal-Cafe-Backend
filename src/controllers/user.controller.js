const userService = require("../services/user.service");
const { sendResponse } = require("../utils/response");

const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= GET PROFILE ================= */

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userService.getUserById(userId);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.USER.FETCH_SINGLE_SUCCESS,
      data: user,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= GET ALL USERS ================= */

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.USER.FETCH_SUCCESS,
      data: users,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= UPDATE USER ================= */

const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await userService.updateUser(userId, req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.USER.UPDATED,
      data: user,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= DELETE USER ================= */

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    await userService.deleteUser(userId);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.USER.DELETED,
      data: null,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

module.exports = {
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser,
};
