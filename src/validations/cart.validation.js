const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* ================= ADD TO CART ================= */

const addToCartValidation = Joi.object({
  product: Joi.string().trim().length(24).required().messages({
    "string.empty": VALIDATIONS.CART.PRODUCT_REQUIRED,
    "string.length": VALIDATIONS.CART.PRODUCT_INVALID,
    "any.required": VALIDATIONS.CART.PRODUCT_REQUIRED,
  }),

  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.base": VALIDATIONS.CART.QUANTITY_INVALID,
    "number.min": VALIDATIONS.CART.QUANTITY_MIN,
  }),
});

module.exports = {
  addToCartValidation,
};
