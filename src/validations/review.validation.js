const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* ================= CREATE REVIEW ================= */

const createReviewValidation = Joi.object({
  product: Joi.string().required().messages({
    "string.empty": VALIDATIONS.REVIEW.PRODUCT_REQUIRED,
    "any.required": VALIDATIONS.REVIEW.PRODUCT_REQUIRED,
  }),

  rating: Joi.number().min(1).max(5).required().messages({
    "number.base": VALIDATIONS.REVIEW.RATING_REQUIRED,
    "any.required": VALIDATIONS.REVIEW.RATING_REQUIRED,
    "number.min": VALIDATIONS.REVIEW.RATING_INVALID,
    "number.max": VALIDATIONS.REVIEW.RATING_INVALID,
  }),

  comment: Joi.string().allow("", null).messages({
    "string.base": VALIDATIONS.REVIEW.COMMENT_INVALID,
  }),
});

/* ================= UPDATE REVIEW ================= */

const updateReviewValidation = Joi.object({
  rating: Joi.number().min(1).max(5).messages({
    "number.min": VALIDATIONS.REVIEW.RATING_INVALID,
    "number.max": VALIDATIONS.REVIEW.RATING_INVALID,
  }),

  comment: Joi.string().allow("", null),
});

module.exports = {
  createReviewValidation,
  updateReviewValidation,
};
