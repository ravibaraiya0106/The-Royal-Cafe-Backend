const Joi = require("joi");

const createRazorpayOrderValidation = Joi.object({
  amount: Joi.number().positive().required().messages({
    "number.base": "Amount must be a number",
    "number.positive": "Amount must be greater than 0",
    "any.required": "Amount is required",
  }),
  currency: Joi.string().trim().uppercase().default("INR"),
  notes: Joi.object().optional().default({}),
});

const verifyRazorpayPaymentValidation = Joi.object({
  razorpay_order_id: Joi.string().trim().required().messages({
    "string.empty": "Razorpay order ID is required",
    "any.required": "Razorpay order ID is required",
  }),
  razorpay_payment_id: Joi.string().trim().required().messages({
    "string.empty": "Razorpay payment ID is required",
    "any.required": "Razorpay payment ID is required",
  }),
  razorpay_signature: Joi.string().trim().required().messages({
    "string.empty": "Razorpay signature is required",
    "any.required": "Razorpay signature is required",
  }),
});

module.exports = {
  createRazorpayOrderValidation,
  verifyRazorpayPaymentValidation,
};
