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

app.use("/uploads", express.static("uploads"));
/* ================= API VERSION ================= */

const API_PREFIX = "/api/v1";

/* ================= ROUTES ================= */

// Auth Routes
app.use(`${API_PREFIX}/auth`, require("./src/routes/auth.routes"));

// Category Routes
app.use(`${API_PREFIX}/category`, require("./src/routes/category.routes"));

// Product Routes
app.use(`${API_PREFIX}/product`, require("./src/routes/product.routes"));

// User Routes
app.use(`${API_PREFIX}/user`, require("./src/routes/user.routes"));

// Contact Routes
app.use(`${API_PREFIX}/contact`, require("./src/routes/contact.routes"));

// Review Routes
app.use(`${API_PREFIX}/review`, require("./src/routes/review.routes"));

// Cart Routes
app.use(`${API_PREFIX}/cart`, require("./src/routes/cart.routes"));

// Coupon Routes
app.use(`${API_PREFIX}/coupon`, require("./src/routes/coupon.routes"));

/* ================= HEALTH CHECK ================= */

app.get("/", (req, res) => {
  sendResponse(res, {
    success: SUCCESS.YES,
    message: MESSAGES.COMMON.HEALTH_CHECK,
    statusCode: STATUS_CODES.OK,
  });
});

/* ================= 404 HANDLER ================= */

app.use((req, res) => {
  sendResponse(res, {
    success: SUCCESS.NO,
    message: MESSAGES.COMMON.ROUTE_NOT_FOUND,
    statusCode: STATUS_CODES.NOT_FOUND,
  });
});

module.exports = app;
