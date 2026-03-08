const { MESSAGES } = require("../constants/constant");

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: MESSAGES.COMMON.VALIDATION_ERROR,
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

module.exports = validate;
