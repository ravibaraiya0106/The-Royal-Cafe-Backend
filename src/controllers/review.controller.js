const reviewService = require("../services/review.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= CREATE REVIEW ================= */
const createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const review = await reviewService.createReview(userId, req.body);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.REVIEW.CREATE_SUCCESS,
      data: review,
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

/* ================= GET ALL REVIEWS ================= */
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewService.getAllReviews();

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.REVIEW.FETCH_SUCCESS,
      data: reviews,
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

/* ================= GET REVIEW  ================= */
const getReview = async (req, res) => {
  try {
    const review = await reviewService.getReviewById(req.params.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.REVIEW.FETCH_SUCCESS,
      data: review,
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

/* ================= UPDATE REVIEW ================= */
const updateReview = async (req, res) => {
  try {
    const review = await reviewService.updateReview(req.params.id, req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.REVIEW.UPDATE_SUCCESS,
      data: review,
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

/* ================= DELETE REVIEW ================= */
const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(req.params.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.REVIEW.DELETE_SUCCESS,
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
  createReview,
  getAllReviews,
  getReview,
  updateReview,
  deleteReview,
};
