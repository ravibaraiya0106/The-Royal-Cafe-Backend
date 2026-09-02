const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const paymentController = require("../controllers/payment.controller");
const {
  createRazorpayOrderValidation,
  verifyRazorpayPaymentValidation,
} = require("../validations/payment.validation");

/* ================= CREATE RAZORPAY ORDER ================= */
router.post(
  "/create-order",
  authMiddleware,
  validate(createRazorpayOrderValidation),
  paymentController.createRazorpayOrder,
);

/* ================= VERIFY RAZORPAY PAYMENT ================= */
router.post(
  "/verify",
  authMiddleware,
  validate(verifyRazorpayPaymentValidation),
  paymentController.verifyRazorpayPayment,
);

/* ================= RAZORPAY WEBHOOK =================
   NOTE: The webhook endpoint is registered in app.js BEFORE express.json()
   because it requires the raw request body for signature verification.
   This route definition is kept here only for reference and is effectively
   a no-op since the actual handler runs earlier in the middleware chain.
*/
router.post("/webhook", paymentController.razorpayWebhook);

module.exports = router;
