const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* ================= CREATE PRODUCT VALIDATIONS ================= */

const createProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": VALIDATIONS.PRODUCT.NAME_REQUIRED,
    "string.min": VALIDATIONS.PRODUCT.NAME_MIN,
    "string.max": VALIDATIONS.PRODUCT.NAME_MAX,
  }),

  category: Joi.string().required().messages({
    "string.empty": VALIDATIONS.PRODUCT.CATEGORY_REQUIRED,
  }),

  description: Joi.string().allow("", null),

  price: Joi.number().min(0).required().messages({
    "number.base": VALIDATIONS.PRODUCT.PRICE_REQUIRED,
    "number.min": VALIDATIONS.PRODUCT.PRICE_MIN,
  }),

  is_special: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.PRODUCT.IS_SPECIAL_BOOLEAN,
  }),

  is_available: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.PRODUCT.IS_AVAILABLE_BOOLEAN,
  }),
});

/* ================= UPDATE PRODUCT VALIDATIONS ================= */

const updateProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": VALIDATIONS.PRODUCT.NAME_MIN,
    "string.max": VALIDATIONS.PRODUCT.NAME_MAX,
  }),

  category: Joi.string(),

  description: Joi.string().allow("", null),

  price: Joi.number().min(0).messages({
    "number.min": VALIDATIONS.PRODUCT.PRICE_MIN,
  }),

  is_special: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.PRODUCT.IS_SPECIAL_BOOLEAN,
  }),

  is_available: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.PRODUCT.IS_AVAILABLE_BOOLEAN,
  }),
});

module.exports = {
  createProductValidation,
  updateProductValidation,
};
