const express = require("express");
const router = express.Router();

const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { addToCartValidation } = require("../validations/cart.validation");
const multer = require("multer");
const upload = multer();

/* ================= ADD TO CART ================= */
router.post(
  "/add",
  upload.none(),
  authMiddleware,
  validate(addToCartValidation),
  cartController.addToCart,
);

/* ================= REMOVE TO CART ================= */
router.post(
  "/remove",
  upload.none(),
  authMiddleware,
  cartController.removeToCart,
);

/* ================= GET USER CART ================= */
router.get("/list", authMiddleware, cartController.getUserCart);

/* ================= DELETE FROM CART ================= */
router.delete("/delete/:id", authMiddleware, cartController.removeFromCart);

/* ================= CLEAR CART ================= */
router.delete("/clear", authMiddleware, cartController.clearCart);

/* ================= USER CART COUNT ================= */
router.get("/count", authMiddleware, cartController.userCartCount);

module.exports = router;
