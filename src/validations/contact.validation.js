const Joi = require("joi");
const { VALIDATIONS } = require("../constants/constant");

/* ================= CREATE CONTACT VALIDATIONS ================= */

const createContactValidation = Joi.object({
  name: Joi.string().trim().min(2).max(50).required().messages({
    "string.empty": VALIDATIONS.CONTACT.NAME_REQUIRED,
    "string.min": VALIDATIONS.CONTACT.NAME_MIN,
    "string.max": VALIDATIONS.CONTACT.NAME_MAX,
  }),

  email: Joi.string().email().required().messages({
    "string.empty": VALIDATIONS.CONTACT.EMAIL_REQUIRED,
    "string.email": VALIDATIONS.CONTACT.EMAIL_INVALID,
  }),

  phone: Joi.string().allow("", null),

  subject: Joi.string().allow("", null),

  message: Joi.string().required().messages({
    "string.empty": VALIDATIONS.CONTACT.MESSAGE_REQUIRED,
  }),
});

/* ================= REPLY CONTACT VALIDATIONS ================= */

const replyContactValidation = Joi.object({
  reply_message: Joi.string().required().messages({
    "string.empty": VALIDATIONS.CONTACT.REPLY_REQUIRED,
  }),
});

module.exports = {
  createContactValidation,
  replyContactValidation,
};
