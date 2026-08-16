const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  registerValidation,
  loginValidation,
} = require("../validations/user.validation");

/* ================= REGISTER USER ================= */
router.post(
  "/register",
  upload.none(),
  validate(registerValidation),
  authController.register,
);

/* ================= LOGIN USER ================= */
router.post(
  "/login",
  upload.none(),
  validate(loginValidation),
  authController.login,
);

/* ================= LOGOUT USER ================= */
router.post("/logout", upload.none(), authMiddleware, authController.logout);

/* ================= RESET PASSWORD ================= */
router.put(
  "/reset-password",
  upload.none(),
  authMiddleware,
  authController.resetPassword,
);

/* ================= FORGOT PASSWORD ================= */
router.post("/forgot-password", upload.none(), authController.forgotPassword);

/* ================= CONFIRM RESET PASSWORD ================= */
router.post("/confirm-reset-password", upload.none(), authController.confirmResetPassword);

module.exports = router;
