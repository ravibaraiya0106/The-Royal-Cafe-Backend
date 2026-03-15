const Review = require("../models/review.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE REVIEW ================= */
const createReview = async (userId, data = {}) => {
  const review = await Review.create({
    user: userId,
    product: data.product,
    rating: data.rating,
    comment: data.comment,
  });
  return review;
};

/* ================= GET ALL REVIEWS ================= */
const getAllReviews = async () => {
  const reviews = await Review.find({
    is_active: true,
  })
    .populate("user", "username")
    .populate("product", "name")
    .sort({ createdAt: -1 });
  return reviews;
};

/* ================= GET REVIEW BY ID ================= */
const getReviewById = async (id = null) => {
  const review = await Review.findOne({
    _id: id,
    is_active: true,
  })
    .populate("user", "username")
    .populate("product", "name");
  if (!review) {
    throw new Error(MESSAGES.REVIEW.NOT_FOUND);
  }
  return review;
};

/* ================= UPDATE REVIEW ================= */
const updateReview = async (id = null, data = {}) => {
  const review = await Review.findOneAndUpdate(
    { _id: id, is_active: true },
    {
      rating: data.rating,
      comment: data.comment,
    },

    { new: true },
  );

  if (!review) {
    throw new Error(MESSAGES.REVIEW.NOT_FOUND);
  }

  return review;
};

/* ================= UPDATE REVIEW ================= */
const deleteReview = async (id = null) => {
  const review = await Review.findOneAndUpdate(
    { _id: id },
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );

  if (!review) {
    throw new Error(MESSAGES.REVIEW.NOT_FOUND);
  }
  return true;
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
