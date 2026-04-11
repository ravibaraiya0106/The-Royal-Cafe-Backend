const contactService = require("../services/contact.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= CREATE CONTACT ================= */
const createContact = async (req, res) => {
  try {
    const contact = await contactService.createContact(req.body);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CONTACT.CREATE_SUCCESS,
      data: contact,
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

/* ================= GET ALL CONTACT ================= */
const getAllContacts = async (req, res) => {
  try {
    const contacts = await contactService.getAllContacts(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CONTACT.FETCH_SUCCESS,
      data: contacts,
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

/* ================= GET CONTACT ================= */
const getContact = async (req, res) => {
  try {
    const contact = await contactService.getContactById(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CONTACT.FETCH_SUCCESS,
      data: contact,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.CONTACT.NOT_FOUND,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= REPLY CONTACT ================= */
const replyContact = async (req, res) => {
  console.log("body", req.body);
  try {
    const { id, reply_message } = req.body;

    const contact = await contactService.replyContact(id, { reply_message });

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CONTACT.REPLY_SUCCESS,
      data: contact,
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

/* ================= DELETE CONTACT ================= */
const deleteContact = async (req, res) => {
  try {
    await contactService.deleteContact(req.params.id);
    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CONTACT.DELETE_SUCCESS,
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
  createContact,
  getAllContacts,
  getContact,
  replyContact,
  deleteContact,
};
