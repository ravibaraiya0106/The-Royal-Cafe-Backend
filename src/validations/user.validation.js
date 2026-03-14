const Joi = require("joi");
const { ROLES } = require("../constants/constant");
const { VALIDATIONS } = require("../constants/constant");

/* ================= REGISTER VALIDATION ================= */

const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": VALIDATIONS.USER.USERNAME_REQUIRED,
    "string.min": VALIDATIONS.USER.USERNAME_MIN,
    "string.max": VALIDATIONS.USER.USERNAME_MAX,
  }),

  first_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": VALIDATIONS.USER.FIRST_NAME_REQUIRED,
    "string.min": VALIDATIONS.USER.FIRST_NAME_MIN,
    "string.max": VALIDATIONS.USER.FIRST_NAME_MAX,
  }),

  last_name: Joi.string().max(50).allow("", null).messages({
    "string.max": VALIDATIONS.USER.LAST_NAME_MAX,
  }),

  email: Joi.string().email().required().messages({
    "string.email": VALIDATIONS.USER.EMAIL_INVALID,
    "string.empty": VALIDATIONS.USER.EMAIL_REQUIRED,
  }),

  phone_no: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": VALIDATIONS.USER.PHONE_INVALID,
      "string.empty": VALIDATIONS.USER.PHONE_REQUIRED,
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": VALIDATIONS.USER.PASSWORD_MIN,
    "string.empty": VALIDATIONS.USER.PASSWORD_REQUIRED,
  }),

  role: Joi.string().valid(ROLES.ADMIN, ROLES.USER).optional(),
});

/* ================= LOGIN VALIDATION ================= */

const loginValidation = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": VALIDATIONS.USER.USERNAME_REQUIRED,
  }),

  password: Joi.string().required().messages({
    "string.empty": VALIDATIONS.USER.PASSWORD_REQUIRED,
  }),
});

/* ================= UPDATE USER VALIDATION ================= */

const updateUserValidation = Joi.object({
  username: Joi.string().min(3).max(30).messages({
    "string.min": VALIDATIONS.USER.USERNAME_MIN,
    "string.max": VALIDATIONS.USER.USERNAME_MAX,
  }),

  first_name: Joi.string().min(2).max(50).messages({
    "string.min": VALIDATIONS.USER.FIRST_NAME_MIN,
    "string.max": VALIDATIONS.USER.FIRST_NAME_MAX,
  }),

  last_name: Joi.string().max(50).allow("", null).messages({
    "string.max": VALIDATIONS.USER.LAST_NAME_MAX,
  }),

  email: Joi.string().email().messages({
    "string.email": VALIDATIONS.USER.EMAIL_INVALID,
  }),

  phone_no: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .messages({
      "string.pattern.base": VALIDATIONS.USER.PHONE_INVALID,
    }),

  role: Joi.string().valid(ROLES.ADMIN, ROLES.USER).messages({
    "any.only": VALIDATIONS.USER.ROLE_INVALID,
  }),

  is_active: Joi.boolean().messages({
    "boolean.base": VALIDATIONS.USER.IS_ACTIVE_BOOLEAN,
  }),
});

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
};
