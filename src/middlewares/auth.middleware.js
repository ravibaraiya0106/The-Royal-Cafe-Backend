const jwt = require("jsonwebtoken");
const BlacklistToken = require("../models/blacklistToken.model");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("authHeader", authHeader);

    if (!authHeader) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.AUTH.UNAUTHORIZED_ACCESS,
        statusCode: STATUS_CODES.UNAUTHORIZED,
      });
    }

    const token = authHeader.split(" ")[1];

    const blacklisted = await BlacklistToken.findOne({ token });

    if (blacklisted) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.AUTH.TOKEN_EXPIRED,
        statusCode: STATUS_CODES.UNAUTHORIZED,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: MESSAGES.AUTH.INVALID_TOKEN,
      statusCode: STATUS_CODES.UNAUTHORIZED,
    });
  }
};

module.exports = authMiddleware;
