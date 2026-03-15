const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

const createCouponValidation = Joi.object({
  code: Joi.string().required().messages({
    "string.empty": VALIDATIONS.COUPON.CODE_REQUIRED,
  }),

  discount_type: Joi.string().valid("percentage", "flat").required(),

  discount_value: Joi.number().required(),

  min_order_amount: Joi.number().min(0),

  max_discount: Joi.number().allow(null),

  expiry_date: Joi.date().required(),
});

module.exports = {
  createCouponValidation,
};
