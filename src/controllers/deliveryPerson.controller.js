const deliveryPersonService = require("../services/deliveryPerson.service");
const { sendResponse } = require("../utils/response");

const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= CREATE DELIVERY PERSON ================= */

const createDeliveryPerson = async (req, res) => {
  try {
    const person = await deliveryPersonService.createDeliveryPerson(req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY_PERSON.CREATED,
      data: person,
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

/* ================= GET ALL DELIVERY PERSONS ================= */

const getDeliveryPersons = async (req, res) => {
  try {
    const persons = await deliveryPersonService.getDeliveryPersons(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY_PERSON.FETCH_SUCCESS,
      data: persons,
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

/* ================= GET DELIVERY PERSON ================= */

const getDeliveryPerson = async (req, res) => {
  try {
    const person = await deliveryPersonService.getDeliveryPerson(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY_PERSON.FETCH_SINGLE_SUCCESS,
      data: person,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.NOT_FOUND,
    });
  }
};

/* ================= UPDATE DELIVERY PERSON ================= */

const updateDeliveryPerson = async (req, res) => {
  try {
    const person = await deliveryPersonService.updateDeliveryPerson(
      req.params.id,
      req.body,
    );

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY_PERSON.UPDATED,
      data: person,
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

/* ================= DELETE DELIVERY PERSON ================= */

const deleteDeliveryPerson = async (req, res) => {
  try {
    await deliveryPersonService.deleteDeliveryPerson(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.DELIVERY_PERSON.DELETED,
      data: null,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.NOT_FOUND,
    });
  }
};

module.exports = {
  createDeliveryPerson,
  getDeliveryPersons,
  getDeliveryPerson,
  updateDeliveryPerson,
  deleteDeliveryPerson,
};
