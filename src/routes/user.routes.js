const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { updateUserValidation } = require("../validations/user.validation");

/* ================= GET ALL USERS ================= */

router.get("/list", authMiddleware, userController.getAllUsers);

/* ================= GET USER BY ID ================= */

router.get("/:id", authMiddleware, userController.getProfile);

/* ================= UPDATE USER ================= */

router.put(
  "/update/:id",
  authMiddleware,
  upload.none(),
  validate(updateUserValidation),
  userController.updateUser,
);

/* ================= DELETE USER ================= */

router.delete("/delete/:id", authMiddleware, userController.deleteUser);

module.exports = router;
