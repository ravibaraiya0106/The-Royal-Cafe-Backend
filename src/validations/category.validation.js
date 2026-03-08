const Joi = require("joi");

/* ================= CREATE CATEGORY ================= */

const createCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Category name is required",
  }),

  description: Joi.string().allow("", null),

  image: Joi.string().allow("", null),

  is_active: Joi.boolean(),
});

/* ================= UPDATE CATEGORY ================= */

const updateCategoryValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  description: Joi.string().allow("", null),

  image: Joi.string().allow("", null),

  is_active: Joi.boolean(),
});

module.exports = {
  createCategoryValidation,
  updateCategoryValidation,
};
