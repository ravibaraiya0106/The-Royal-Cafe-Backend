const productService = require("../services/product.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, PATHS } = require("../constants/constant");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE PRODUCT ================= */

const createProduct = async (req, res) => {
  try {
    const data = req.body;

    if (req.file) {
      data.image = `${PATHS.PRODUCT_IMAGE_PUBLIC}/${req.file.filename}`;
    }

    const product = await productService.createProduct(data);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PRODUCT.CREATE_SUCCESS,
      data: product,
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

/* ================= GET ALL PRODUCTS ================= */

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PRODUCT.FETCH_SUCCESS,
      data: products,
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

/* ================= GET PRODUCT BY ID ================= */

const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productService.getProductById(id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PRODUCT.FETCH_SUCCESS,
      data: product,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.PRODUCT.NOT_FOUND,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= UPDATE PRODUCT ================= */

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (req.file) {
      data.image = `${PATHS.PRODUCT_IMAGE_PUBLIC}/${req.file.filename}`;
    }

    const product = await productService.updateProduct(id, data);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PRODUCT.UPDATE_SUCCESS,
      data: product,
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

/* ================= DELETE PRODUCT ================= */

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await productService.deleteProduct(id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PRODUCT.DELETE_SUCCESS,
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
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
