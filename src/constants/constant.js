/* Success Flags */
const SUCCESS = {
  YES: true,
  NO: false,
};

/* Upload Paths */
const PATHS = {
  CATEGORY_IMAGE_UPLOAD: "uploads/categories",
  CATEGORY_IMAGE_PUBLIC: "/uploads/categories",
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
    LOGOUT_SUCCESS: "Logout successful",
    INVALID_CREDENTIALS: "Invalid username or password",
    USER_ALREADY_EXISTS: "User already exists",
    EMAIL_ALREADY_EXISTS: "Email already registered",
    USERNAME_ALREADY_EXISTS: "Username already taken",
    PASSWORD_REQUIRED: "Password is required",
    ACCOUNT_INACTIVE: "Account is inactive",
    UNAUTHORIZED_ACCESS: "Unauthorized access",
  },

  USER: {
    USER_NOT_FOUND: "User not found",
    USER_FETCH_SUCCESS: "User fetched successfully",
    USER_UPDATED: "User updated successfully",
    USER_DELETED: "User deleted successfully",
  },

  CATEGORY: {
    CREATE_SUCCESS: "Category created successfully.",
    UPDATE_SUCCESS: "Category updated successfully.",
    DELETE_SUCCESS: "Category deleted successfully.",
    LIST: "Category list fetched successfully.",
    DETAILS: "Category details fetched successfully.",
    NOT_FOUND: "Category not found.",
    ALREADY_EXISTS: "Category already exists.",
  },

  COMMON: {
    HEALTH_CHECK: "Royal Cafe API running",
    ROUTE_NOT_FOUND: "Route not found",
    SERVER_ERROR: "Something went wrong",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token has expired, please login again",
    TOKEN_REQUIRED: "Token is required",
    UNAUTHORIZED_ACCESS: "Unauthorized access",
  },
};

const VALIDATION = {};

module.exports = {
  SUCCESS,
  ROLES,
  ACCOUNT_STATUS,
  STATUS_CODES,
  MESSAGES,
  PATHS,
  VALIDATION,
};
