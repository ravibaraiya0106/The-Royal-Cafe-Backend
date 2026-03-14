const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/review.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const multer = require("multer");
const upload = multer();

const {
  createReviewValidation,
  updateReviewValidation,
} = require("../validations/review.validation");

/* ================= CREATE REVIEW ================= */

router.post(
  "/create",
  upload.none(),
  authMiddleware,
  validate(createReviewValidation),
  reviewController.createReview,
);

/* ================= GET ALL REVIEWS ================= */

router.get("/list", reviewController.getAllReviews);

/* ================= GET REVIEW ================= */

router.get("/:id", reviewController.getReview);

/* ================= UPDATE REVIEW ================= */

router.put(
  "/update/:id",
  upload.none(),
  authMiddleware,
  validate(updateReviewValidation),
  reviewController.updateReview,
);

/* ================= DELETE REVIEW ================= */

router.delete("/delete/:id", authMiddleware, reviewController.deleteReview);

module.exports = router;
