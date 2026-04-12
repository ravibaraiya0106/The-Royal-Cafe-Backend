const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* ================= BASE SCHEMA ================= */
const baseCouponSchema = {
  code: Joi.string().messages({
    "string.empty": VALIDATIONS.COUPON.CODE_REQUIRED,
  }),

  description: Joi.string().allow("").optional(),

  discount_type: Joi.string().valid("percentage", "flat"),

  discount_value: Joi.number(),

  min_order_amount: Joi.number().min(0).optional(),

  max_discount: Joi.number().allow(null).optional(),

  expiry_date: Joi.date(),

  usage_limit: Joi.number().allow(null).optional(),
};

/* ================= CREATE COUPON ================= */
const createCouponValidation = Joi.object({
  ...baseCouponSchema,

  code: baseCouponSchema.code.required(),

  discount_type: baseCouponSchema.discount_type.required(),

  discount_value: baseCouponSchema.discount_value.required(),

  expiry_date: baseCouponSchema.expiry_date.required(),
});

/* ================= UPDATE COUPON ================= */
const updateCouponValidation = Joi.object({
  ...baseCouponSchema,
}).min(1);
//  At least one field required for update

module.exports = {
  createCouponValidation,
  updateCouponValidation,
};
