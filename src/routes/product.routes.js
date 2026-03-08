const express = require("express");
const router = express.Router();

const productController = require("../controllers/product.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const {
  createProductValidation,
  updateProductValidation,
} = require("../validations/product.validation");

const { uploadProductImage } = require("../middlewares/upload.middleware");

/* ================= CREATE PRODUCT ================= */

router.post(
  "/create",
  authMiddleware,
  uploadProductImage.single("image"),
  validate(createProductValidation),
  productController.createProduct,
);

/* ================= GET ALL PRODUCTS ================= */

router.get("/list", productController.getAllProducts);

/* ================= GET PRODUCT BY ID ================= */

router.get("/:id", productController.getProductById);

/* ================= UPDATE PRODUCT ================= */

router.put(
  "/update/:id",
  authMiddleware,
  uploadProductImage.single("image"),
  validate(updateProductValidation),
  productController.updateProduct,
);

/* ================= DELETE PRODUCT ================= */

router.delete("/delete/:id", authMiddleware, productController.deleteProduct);

module.exports = router;
