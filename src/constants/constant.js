/* Success Flags */
const SUCCESS = {
  YES: true,
  NO: false,
};

/* User Roles */
const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

/* Account Status */
const ACCOUNT_STATUS = {
  ACTIVE: true,
  INACTIVE: false,
};

/* HTTP Status Codes */
const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

/* Common Messages */
const MESSAGES = {
  AUTH: {
    REGISTER_SUCCESS: "User registered successfully",
    LOGIN_SUCCESS: "Login successful",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_ALREADY_EXISTS: "User already exists",
    ACCOUNT_INACTIVE: "Account is inactive",
    SERVER_ERROR: "Something went wrong",
  },
  USER: {
    USER_NOT_FOUND: "User not found",
  },
  COMMONN: {
    HEALTH_CHECK :"Royal Cafe API running",
    ROUTE_NOT_FOUND :"Route not found",
  }
};

module.exports = {
  SUCCESS,
  ROLES,
  ACCOUNT_STATUS,
  STATUS_CODES,
  MESSAGES,
};
