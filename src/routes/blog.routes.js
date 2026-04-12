const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blog.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  createBlogValidation,
  updateBlogValidation,
} = require("../validations/blog.validation");

const { uploadBlogImage } = require("../middlewares/upload.middleware");

/* ================= CREATE PRODUCT ================= */

router.post(
  "/create",
  authMiddleware,
  uploadBlogImage.single("image"),
  validate(createBlogValidation),
  blogController.createBlog,
);

/* ================= GET ALL PRODUCTS ================= */

router.get("/list", authMiddleware, blogController.getAllBlogs);

/* ================= GET PRODUCT BY ID ================= */

router.get("/:id", blogController.getBlog);

/* ================= UPDATE PRODUCT ================= */

router.put(
  "/update/:id",
  authMiddleware,
  uploadBlogImage.single("image"),
  validate(updateBlogValidation),
  blogController.updateBlog,
);

/* ================= DELETE PRODUCT ================= */

router.delete("/delete/:id", authMiddleware, blogController.deleteBlog);

module.exports = router;
