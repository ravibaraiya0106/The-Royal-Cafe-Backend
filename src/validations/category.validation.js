const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* ================= CREATE CATEGORY ================= */

const createCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": VALIDATIONS.CATEGORY.NAME_REQUIRED,
    "string.min": VALIDATIONS.CATEGORY.NAME_MIN,
    "string.max": VALIDATIONS.CATEGORY.NAME_MAX,
  }),

  description: Joi.string().allow("", null),

  image: Joi.string().allow("", null),

  is_active: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.CATEGORY.IS_ACTIVE_BOOLEAN,
  }),
});

/* ================= UPDATE CATEGORY ================= */

const updateCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    "string.min": VALIDATIONS.CATEGORY.NAME_MIN,
    "string.max": VALIDATIONS.CATEGORY.NAME_MAX,
  }),

  description: Joi.string().allow("", null),

  image: Joi.string().allow("", null),

  is_active: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.CATEGORY.IS_ACTIVE_BOOLEAN,
  }),
});

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
