const couponService = require("../services/coupon.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= CREATE COUPON ================= */
const createCoupon = async (req, res) => {
  try {
    console.log("Creating coupon with data:", req.body);
    const coupon = await couponService.createCoupon(req.body);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.COUPON.CREATE_SUCCESS,
      data: coupon,
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

/* ================= GET ALL COUPONS ================= */
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.COUPON.FETCH_SUCCESS,
      data: coupons,
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

/* ================= GET COUPON ================= */
const getCoupon = async (req, res) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.COUPON.FETCH_SUCCESS,
      data: coupon,
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

/* ================= UPDATE COUPON ================= */
const updateCoupon = async (req, res) => {
  try {
    console.log("Updating coupon with data:", req.body);
    const coupon = await couponService.updateCoupon(req.params.id, req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.COUPON.UPDATE_SUCCESS,
      data: coupon,
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

/* ================= DELETE COUPON ================= */
const deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.COUPON.DELETE_SUCCESS,
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
  createCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
