/* Success Flags */
const SUCCESS = {
  YES: true,
  NO: false,
};

/* Upload Paths */
const PATHS = {
  CATEGORY_IMAGE_UPLOAD: "uploads/categories",
  CATEGORY_IMAGE_PUBLIC: "/uploads/categories",
  PRODUCT_IMAGE_UPLOAD: "uploads/products",
  PRODUCT_IMAGE_PUBLIC: "/uploads/products",
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
    NOT_FOUND: "User not found",
    FETCH_SUCCESS: "Users fetched successfully",
    FETCH_SINGLE_SUCCESS: "User fetched successfully",
    UPDATED: "User updated successfully",
    DELETED: "User deleted successfully",
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
  PRODUCT: {
    CREATE_SUCCESS: "Product created successfully",
    UPDATE_SUCCESS: "Product updated successfully",
    DELETE_SUCCESS: "Product deleted successfully",
    FETCH_SUCCESS: "Products fetched successfully",
    NOT_FOUND: "Product not found",
    ALREADY_EXISTS: "Product already exists in this category",
  },
  COMMON: {
    HEALTH_CHECK: "Royal Cafe API running",
    ROUTE_NOT_FOUND: "Route not found",
    SERVER_ERROR: "Something went wrong",
    INVALID_TOKEN: "Invalid token",
    TOKEN_EXPIRED: "Token has expired, please login again",
    TOKEN_REQUIRED: "Token is required",
    UNAUTHORIZED_ACCESS: "Unauthorized access",
    VALIDATION_ERROR: "Validation error",
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
