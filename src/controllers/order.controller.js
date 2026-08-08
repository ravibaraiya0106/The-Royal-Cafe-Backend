const orderService = require("../services/order.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= CREATE ORDER ================= */
const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address, phone, payment_method, notes, coupon_code } = req.body;

    const result = await orderService.createOrder(userId, {
      address,
      phone,
      payment_method,
      notes,
      coupon_code,
    });

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.ORDER.CREATE_SUCCESS,
      data: result,
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

/* ================= USER ORDER HISTORY ================= */
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await orderService.getUserOrders(userId);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.ORDER.FETCH_SUCCESS,
      data: orders,
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

/* ================= USER ORDER DETAILS ================= */
const getUserOrderDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await orderService.getUserOrderDetails(userId, id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.ORDER.DETAILS_SUCCESS,
      data: result,
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

/* ================= ADMIN ORDER HISTORY ================= */
const getAdminOrders = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.COMMON.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.FORBIDDEN,
      });
    }

    const orders = await orderService.getAdminOrders(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.ORDER.ADMIN_FETCH_SUCCESS,
      data: orders,
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

/* ================= ADMIN ANALYTICS ================= */
const getAdminAnalytics = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.COMMON.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.FORBIDDEN,
      });
    }

    const analytics = await orderService.getAdminAnalytics();

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.ORDER.ANALYTICS_SUCCESS,
      data: analytics,
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
  createOrder,
  getUserOrders,
  getUserOrderDetails,
  getAdminOrders,
  getAdminAnalytics,
};

