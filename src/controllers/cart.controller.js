const cartService = require("../services/cart.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= ADD TO CART ================= */
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.addToCart(userId, req.body);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CART.ADD_SUCCESS,
      data: cart,
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

/* ================= REMOVE TO CART ================= */
const removeToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.removeToCart(userId, req.body.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CART.REMOVE_SUCCESS,
      data: cart,
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

/* ================= GET USER CART ================= */
const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getUserCart(userId);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CART.FETCH_SUCCESS,
      data: cart,
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

/* ================= DELETE CART ITEM ================= */
const removeFromCart = async (req, res) => {
  try {
    await cartService.removeFromCart(req.params.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CART.DELETE_SUCCESS,
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

/* ================= CLEAR CART ================= */
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await cartService.clearCart(userId);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CART.CLEAR_SUCCESS,
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

/* ================= USER CART COUNT ================= */
const userCartCount = async (req, res) => {
  try {
    const userId = req.user.id;
    const count = await cartService.userCartCount(userId);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CART.COUNT_SUCCESS,
      data: count,
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
  addToCart,
  getUserCart,
  removeToCart,
  removeFromCart,
  clearCart,
  userCartCount,
};
