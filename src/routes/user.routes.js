const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { updateUserValidation } = require("../validations/user.validation");

/* ================= GET ALL PRODUCTS ================= */

router.get("/list", authMiddleware, userController.getAllUsers);

/* ================= GET PRODUCT BY ID ================= */

router.get("/:id", authMiddleware, userController.getProfile);

/* ================= UPDATE PRODUCT ================= */

router.put(
  "/update/:id",
  authMiddleware,
  upload.none(),
  validate(updateUserValidation),
  userController.updateUser,
);

/* ================= DELETE PRODUCT ================= */

router.delete("/delete/:id", authMiddleware, userController.deleteUser);

module.exports = router;
