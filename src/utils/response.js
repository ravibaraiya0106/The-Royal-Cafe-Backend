const { SUCCESS } = require("../constants/constant");

/* Send Standard API Response */
const sendResponse = (
  res,
  { success = SUCCESS.YES, message = "", data = null, statusCode = 200 },
) => {
  const responseObject = {
    success,
    message,
    responseData: data,
  };

  return res.status(statusCode).json(responseObject);
};

module.exports = {
  sendResponse,
};
