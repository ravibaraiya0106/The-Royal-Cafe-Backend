const deliveryService = require("../services/delivery.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= ASSIGN DELIVERY (ADMIN) ================= */
const assignDelivery = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.COMMON.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.FORBIDDEN,
      });
    }

    const delivery = await deliveryService.assignDelivery(req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.ASSIGNED_SUCCESS,
      data: delivery,
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

/* ================= GET MY DELIVERIES (DELIVERY BOY) ================= */
const getMyDeliveries = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await deliveryService.getMyDeliveries(userId, req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.FETCH_SUCCESS,
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

/* ================= GET DELIVERY DETAILS ================= */
const getDeliveryDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.role === "admin" ? null : req.user.id;

    const delivery = await deliveryService.getDeliveryDetails(id, userId);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.FETCH_SUCCESS,
      data: delivery,
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

/* ================= UPDATE DELIVERY STATUS (DELIVERY BOY) ================= */
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const delivery = await deliveryService.updateDeliveryStatus(
      id,
      userId,
      req.body,
    );

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.STATUS_UPDATED,
      data: delivery,
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

/* ================= TOGGLE AVAILABILITY ================= */
const toggleAvailability = async (req, res) => {
  try {
    const userId = req.user.id;
    const { is_available } = req.body;

    const dp = await deliveryService.toggleAvailability(userId, is_available);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.AVAILABILITY_TOGGLED,
      data: dp,
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

/* ================= UPDATE LOCATION ================= */
const updateLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { lat, lng } = req.body;

    const dp = await deliveryService.updateLocation(userId, lat, lng);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.LOCATION_UPDATED,
      data: dp,
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

/* ================= GET ADMIN DELIVERIES ================= */
const getAdminDeliveries = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.COMMON.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.FORBIDDEN,
      });
    }

    const result = await deliveryService.getAdminDeliveries(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY.FETCH_SUCCESS,
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

module.exports = {
  assignDelivery,
  getMyDeliveries,
  getDeliveryDetails,
  updateDeliveryStatus,
  toggleAvailability,
  updateLocation,
  getAdminDeliveries,
};
