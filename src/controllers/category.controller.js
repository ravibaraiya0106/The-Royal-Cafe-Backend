const categoryService = require("../services/category.service");
const { sendResponse } = require("../utils/response");

const {
  SUCCESS,
  STATUS_CODES,
  MESSAGES,
  PATHS,
} = require("../constants/constant");

/* ================= CREATE CATEGORY ================= */

const createCategory = async (req, res) => {
  try {
    console.log("➡️ Create Category API called");

    const data = req.body;
    console.log("📦 Request Body:", data);

    if (req.file) {
      console.log("🖼 Uploaded File:", req.file.filename);
      data.image = `${PATHS.CATEGORY_IMAGE_PUBLIC}/${req.file.filename}`;
    }

    console.log("📤 Sending data to service:", data);

    const category = await categoryService.createCategory(data);

    console.log("✅ Category Created:", category);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CATEGORY.CREATE_SUCCESS,
      data: category,
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    console.error("❌ Error in createCategory controller:", error);

    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= GET ALL CATEGORY ================= */

const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CATEGORY.LIST,
      data: categories,
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

/* ================= GET SINGLE CATEGORY ================= */

const getCategory = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CATEGORY.DETAILS,
      data: category,
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

/* ================= UPDATE CATEGORY ================= */

const updateCategory = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.image = `${PATHS.CATEGORY_IMAGE_PUBLIC}/${req.file.filename}`;
    }

    const category = await categoryService.updateCategory(req.params.id, data);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CATEGORY.UPDATE_SUCCESS,
      data: category,
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

/* ================= DELETE CATEGORY ================= */

const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.CATEGORY.DELETE_SUCCESS,
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
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
