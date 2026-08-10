const { MESSAGES } = require("../constants/constant");

const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessages = error.details.map((err) => err.message);
    return res.status(400).json({
      success: false,
      message: errorMessages.join(", ") || MESSAGES.COMMON.VALIDATION_ERROR,
      errors: errorMessages,
    });
  }

  // IMPORTANT: replace request body with validated data
  req.body = value;

  next();
};

module.exports = validate;
