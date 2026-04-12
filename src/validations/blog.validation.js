const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* CREATE */
const createBlogValidation = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    "string.empty": VALIDATIONS.BLOG.TITLE_REQUIRED,
  }),

  description: Joi.string().required().messages({
    "string.empty": VALIDATIONS.BLOG.DESCRIPTION_REQUIRED,
  }),

  image: Joi.string().allow("", null),

  author: Joi.string().allow("", null),
});

/* UPDATE */
const updateBlogValidation = Joi.object({
  title: Joi.string().trim().min(3).max(100),
  description: Joi.string(),
  image: Joi.string().allow("", null),
  author: Joi.string().allow("", null),
});

module.exports = {
  createBlogValidation,
  updateBlogValidation,
};
