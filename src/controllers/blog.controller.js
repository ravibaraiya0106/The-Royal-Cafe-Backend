const blogService = require("../services/blog.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* CREATE */
const createBlog = async (req, res) => {
  try {
    const blog = await blogService.createBlog(req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.BLOG.CREATE_SUCCESS,
      data: blog,
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* GET ALL */
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getAllBlogs(req.query);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.BLOG.FETCH_SUCCESS,
      data: blogs,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* GET ONE */
const getBlog = async (req, res) => {
  try {
    const blog = await blogService.getBlogById(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.BLOG.FETCH_SUCCESS,
      data: blog,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* UPDATE */
const updateBlog = async (req, res) => {
  try {
    const blog = await blogService.updateBlog(req.params.id, req.body);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.BLOG.UPDATE_SUCCESS,
      data: blog,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* DELETE */
const deleteBlog = async (req, res) => {
  try {
    await blogService.deleteBlog(req.params.id);

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.BLOG.DELETE_SUCCESS,
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
};
