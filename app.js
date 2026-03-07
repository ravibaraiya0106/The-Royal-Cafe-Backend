const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { sendResponse } = require("./src/utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("./src/constants/constant");

const app = express();

/* Security */
app.use(helmet());

/* CORS */
app.use(cors());

/* Logging */
app.use(morgan("dev"));

/* Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Routes */
app.use("/api/v1/auth", require("./src/routes/auth.routes"));

/* Health Check */
app.get("/", (req, res) => {
  sendResponse(res, {
    success: SUCCESS.YES,
    message: MESSAGES.COMMON.HEALTH_CHECK,
    statusCode: STATUS_CODES.OK,
  });
});

/* 404 Handler */
app.use((req, res) => {
  sendResponse(res, {
    success: SUCCESS.NO,
    message: MESSAGES.COMMON.ROUTE_NOT_FOUND,
    statusCode: STATUS_CODES.NOT_FOUND,
  });
});

module.exports = app;
