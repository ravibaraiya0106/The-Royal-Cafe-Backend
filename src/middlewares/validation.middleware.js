const { MESSAGES } = require("../constants/constant");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: MESSAGES.COMMON.VALIDATION_ERROR,
      errors: error.details.map((err) => err.message),
    });
  }

  // IMPORTANT: replace request body with validated data
  req.body = value;

  next();
};

module.exports = validate;
