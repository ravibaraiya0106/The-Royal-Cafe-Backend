const Joi = require("joi");
const { ROLES } = require("../constants/constant");

/* ================= REGISTER VALIDATION ================= */

const registerValidation = Joi.object({
  username: Joi.string().min(3).max(30).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters",
  }),

  first_name: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
  }),

  last_name: Joi.string().max(50).allow("", null),

  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
  }),

  phone_no: Joi.string()
    .pattern(/^[0-9]{10,15}$/)
    .required()
    .messages({
      "string.pattern.base": "Phone number must be between 10-15 digits",
      "string.empty": "Phone number is required",
    }),

  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
  }),

  role: Joi.string().valid(ROLES.ADMIN, ROLES.USER).optional(),
});

/* ================= LOGIN VALIDATION ================= */

const loginValidation = Joi.object({
  username: Joi.string().required().messages({
    "string.empty": "Username is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

/* ================= UPDATE USER VALIDATION ================= */

const updateUserValidation = Joi.object({
  username: Joi.string().min(3).max(30),

  first_name: Joi.string().min(2).max(50),

  last_name: Joi.string().max(50).allow("", null),

  email: Joi.string().email(),

  phone_no: Joi.string().pattern(/^[0-9]{10,15}$/),

  role: Joi.string().valid(ROLES.ADMIN, ROLES.USER),

  is_active: Joi.boolean(),
});

module.exports = {
  registerValidation,
  loginValidation,
  updateUserValidation,
};
