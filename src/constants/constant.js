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
  CONTACT: {
    CREATE_SUCCESS: "Message sent successfully",
    LIST: "Contact messages fetched successfully",
    DETAILS: "Contact message details fetched successfully",
    REPLY_SUCCESS: "Reply sent successfully",
    DELETE_SUCCESS: "Contact message deleted successfully",
    NOT_FOUND: "Contact message not found",
  },
  REVIEW: {
    CREATE_SUCCESS: "Review created successfully",
    FETCH_SUCCESS: "Reviews fetched successfully",
    UPDATE_SUCCESS: "Review updated successfully",
    DELETE_SUCCESS: "Review deleted successfully",
    NOT_FOUND: "Review not found",
  },
  CART: {
    ADD_SUCCESS: "Product added to cart successfully",
    REMOVE_SUCCESS: "Product removed from cart successfully",
    FETCH_SUCCESS: "Cart fetched successfully",
    UPDATE_SUCCESS: "Cart updated successfully",
    DELETE_SUCCESS: "Cart item removed successfully",
    CLEAR_SUCCESS: "Cart cleared successfully",
    COUNT_FETCH_SUCCESS: "Cart count fetched successfully",
    NOT_FOUND: "Cart item not found",
    ALREADY_EXISTS: "Product already exists in cart",
    PRODUCT_REQUIRED: "Product is required",
    COUNT_SUCCESS: "Cart count fetched successfully",
  },
  COUPON: {
    CREATE_SUCCESS: "Coupon created successfully",
    UPDATE_SUCCESS: "Coupon updated successfully",
    DELETE_SUCCESS: "Coupon deleted successfully",
    FETCH_SUCCESS: "Coupons fetched successfully",
    NOT_FOUND: "Coupon not found",
    ALREADY_EXISTS: "Coupon already exists",
  },
};

const VALIDATIONS = {
  USER: {
    USERNAME_REQUIRED: "Username is required",
    USERNAME_MIN: "Username must be at least 3 characters",
    USERNAME_MAX: "Username must not exceed 30 characters",
    FIRST_NAME_REQUIRED: "First name is required",
    FIRST_NAME_MIN: "First name must be at least 2 characters",
    FIRST_NAME_MAX: "First name must not exceed 50 characters",
    LAST_NAME_MAX: "Last name must not exceed 50 characters",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Invalid email format",
    PHONE_REQUIRED: "Phone number is required",
    PHONE_INVALID: "Phone number must be between 10-15 digits",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN: "Password must be at least 6 characters",
    ROLE_INVALID: "Invalid user role",
    IS_ACTIVE_BOOLEAN: "is_active must be true or false",
  },
  PRODUCT: {
    NAME_REQUIRED: "Product name is required",
    NAME_MIN: "Product name must be at least 2 characters",
    NAME_MAX: "Product name must not exceed 100 characters",
    CATEGORY_REQUIRED: "Category is required",
    PRICE_REQUIRED: "Product price is required",
    PRICE_MIN: "Product price must be greater than or equal to 0",
    IS_SPECIAL_BOOLEAN: "is_special must be true or false",
    IS_AVAILABLE_BOOLEAN: "is_available must be true or false",
  },
  CONTACT: {
    NAME_REQUIRED: "Name is required",
    NAME_MIN: "Name must be at least 2 characters",
    NAME_MAX: "Name must not exceed 50 characters",
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Invalid email format",
    MESSAGE_REQUIRED: "Message is required",
    REPLY_REQUIRED: "Reply message is required",
    ID_REQUIRED: "ID is required",
  },
  CATEGORY: {
    NAME_REQUIRED: "Category name is required",
    NAME_MIN: "Category name must be at least 2 characters",
    NAME_MAX: "Category name must not exceed 100 characters",
    IS_ACTIVE_BOOLEAN: "is_active must be true or false",
  },
  REVIEW: {
    PRODUCT_REQUIRED: "Product id is required",
    RATING_REQUIRED: "Rating is required",
    RATING_INVALID: "Rating must be between 1 and 5",
    COMMENT_INVALID: "Comment must be a string",
  },
  CART: {
    PRODUCT_REQUIRED: "Product id is required",
    PRODUCT_INVALID: "Invalid product id",
    QUANTITY_REQUIRED: "Quantity is required",
    QUANTITY_INVALID: "Quantity must be a number",
    QUANTITY_MIN: "Quantity must be at least 1",
  },
  COUPON: {
    CODE_REQUIRED: "Coupon code is required",
  },
};

module.exports = {
  SUCCESS,
  ROLES,
  ACCOUNT_STATUS,
  STATUS_CODES,
  MESSAGES,
  PATHS,
  VALIDATIONS,
};
