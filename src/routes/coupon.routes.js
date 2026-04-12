const express = require("express");
const router = express.Router();

const couponController = require("../controllers/coupon.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const { createCouponValidation, updateCouponValidation } = require("../validations/coupon.validation");
const multer = require("multer");
const upload = multer();

/* ================= CREATE COUPON ================= */
router.post(
  "/create",
  upload.none(),
  authMiddleware,
  validate(createCouponValidation),
  couponController.createCoupon,
);

/* ================= GET ALL COUPONS ================= */
router.get("/list", authMiddleware, couponController.getAllCoupons);

/* ================= GET COUPON ================= */
router.get("/:id", authMiddleware, couponController.getCoupon);

/* ================= UPDATE COUPON ================= */
router.put(
  "/update/:id",
  upload.none(),
  authMiddleware,
  validate(updateCouponValidation),
  couponController.updateCoupon,
);

/* ================= DELETE COUPON ================= */
router.delete("/delete/:id", authMiddleware, couponController.deleteCoupon);

module.exports = router;
