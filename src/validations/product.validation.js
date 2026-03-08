const Joi = require("joi");

/* ================= CREATE PRODUCT VALIDATION ================= */

const createProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  category: Joi.string().required(),

  description: Joi.string().allow("", null),

  price: Joi.number().min(0).required(),

  is_special: Joi.boolean().optional(),

  is_available: Joi.boolean().optional(),
});

/* ================= UPDATE PRODUCT VALIDATION ================= */

const updateProductValidation = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),

  category: Joi.string().optional(),

  description: Joi.string().allow("", null).optional(),

  price: Joi.number().min(0).optional(),

  is_special: Joi.boolean().optional(),

  is_available: Joi.boolean().optional(),
});

module.exports = {
  createProductValidation,
  updateProductValidation,
};
