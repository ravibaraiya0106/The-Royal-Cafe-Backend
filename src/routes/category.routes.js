const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/category.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const { uploadCategoryImage } = require("../middlewares/upload.middleware");

/* ================= CREATE CATEGORY ================= */

router.post(
  "/create",
  authMiddleware,
  uploadCategoryImage.single("image"),
  categoryController.createCategory,
);

/* ================= GET ALL CATEGORY ================= */

router.get("/list", authMiddleware, categoryController.getCategories);

/* ================= GET CATEGORY BY ID ================= */

router.get("/:id", authMiddleware, categoryController.getCategory);

/* ================= UPDATE CATEGORY ================= */

router.put(
  "/update/:id",
  authMiddleware,
  uploadCategoryImage.single("image"),
  categoryController.updateCategory,
);

/* ================= DELETE CATEGORY ================= */

router.delete("/delete/:id", authMiddleware, categoryController.deleteCategory);

module.exports = router;
