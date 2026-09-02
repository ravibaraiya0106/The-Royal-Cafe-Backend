const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  createOrderValidation,
  cancelOrderValidation,
} = require("../validations/order.validation");
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

/* ================= CANCEL ORDER ================= */
router.post(
  "/cancel/:id",
  authMiddleware,
  validate(cancelOrderValidation),
  orderController.cancelOrder,
);

/* ================= ADMIN ORDER HISTORY ================= */
router.get("/admin/list", authMiddleware, orderController.getAdminOrders);

/* ================= ADMIN ANALYTICS ================= */
router.get("/admin/analytics", authMiddleware, orderController.getAdminAnalytics);

/* ================= UPDATE PAYMENT STATUS ================= */
router.patch("/update-payment-status/:id", authMiddleware, orderController.updatePaymentStatus);

module.exports = router;

