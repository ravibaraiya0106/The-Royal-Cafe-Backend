const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

router.post("/register", upload.none(), authController.register);
router.post("/login", upload.none(), authController.login);
router.post("/logout", upload.none(), authMiddleware, authController.logout);

module.exports = router;
