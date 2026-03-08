const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/* ================= REGISTER USER ================= */
router.post("/register", upload.none(), authController.register);

/* ================= LOGIN USER ================= */
router.post("/login", upload.none(), authController.login);

/* ================= LOGOUT USER ================= */
router.post("/logout", upload.none(), authMiddleware, authController.logout);

module.exports = router;
