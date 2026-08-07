const Joi = require("joi");

const createOrderValidation = Joi.object({
  address: Joi.string().trim().required().messages({
    "string.empty": "Address is required",
    "any.required": "Address is required",
  }),
  phone: Joi.string().trim().pattern(/^\d{10,15}$/).required().messages({
    "string.empty": "Phone number is required",
    "string.pattern.base": "Phone number must be between 10-15 digits",
    "any.required": "Phone number is required",
  }),
  payment_method: Joi.string()
    .valid("COD", "UPI", "CARD")
    .default("COD"),
  coupon_code: Joi.string().trim().allow("").optional(),
  notes: Joi.string().allow("").optional(),
});

module.exports = {
  createOrderValidation,
};

