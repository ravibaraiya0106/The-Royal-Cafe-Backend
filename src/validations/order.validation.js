const Joi = require("joi");

const createOrderValidation = Joi.object({
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
  latitude: Joi.number().min(-90).max(90).required().messages({
    "number.base": "Latitude must be a number",
    "number.min": "Latitude must be between -90 and 90",
    "number.max": "Latitude must be between -90 and 90",
    "any.required": "Latitude is required",
  }),
  longitude: Joi.number().min(-180).max(180).required().messages({
    "number.base": "Longitude must be a number",
    "number.min": "Longitude must be between -180 and 180",
    "number.max": "Longitude must be between -180 and 180",
    "any.required": "Longitude is required",
  }),
  phone: Joi.string().trim().pattern(/^\d{10,15}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be between 10-15 digits",
    "any.required": "Phone number is required",
  }),
  payment_method: Joi.string()
    .valid("COD", "RAZORPAY")
    .default("COD"),
  razorpay_order_id: Joi.string().trim().allow("").optional(),
  razorpay_payment_id: Joi.string().trim().allow("").optional(),
  razorpay_signature: Joi.string().trim().allow("").optional(),
  coupon_code: Joi.string().trim().allow("").optional(),
  notes: Joi.string().allow("").optional(),
});

const cancelOrderValidation = Joi.object({
  reason: Joi.string().trim().min(3).required().messages({
    "string.empty": "Cancellation reason is required",
    "string.min": "Reason must be at least 3 characters",
    "any.required": "Cancellation reason is required",
  }),
});

module.exports = {
  createOrderValidation,
  cancelOrderValidation,
};

