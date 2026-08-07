const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createOrderValidation } = require("../validations/order.validation");
const orderController = require("../controllers/order.controller");

/* ================= CREATE ORDER ================= */
router.post(
  "/create",
  authMiddleware,
  validate(createOrderValidation),
  orderController.createOrder,
);

/* ================= USER ORDER HISTORY ================= */
router.get("/list", authMiddleware, orderController.getUserOrders);

/* ================= USER ORDER DETAILS ================= */
router.get("/details/:id", authMiddleware, orderController.getUserOrderDetails);

/* ================= ADMIN ORDER HISTORY ================= */
router.get("/admin/list", authMiddleware, orderController.getAdminOrders);

module.exports = router;

