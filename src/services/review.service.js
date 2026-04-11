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
const getAllReviews = async (query = {}) => {
  const { page = 1, limit = 10, username, email, product, rating } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const match = { is_active: true };

  if (rating) match.rating = Number(rating);

  const pipeline = [
    { $match: match },

    /* JOIN USER */
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },

    /* JOIN PRODUCT */
    {
      $lookup: {
        from: "products",
        localField: "product",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: "$product" },

    /* USER FILTER */
    ...(username
      ? [
          {
            $match: {
              "user.username": { $regex: username, $options: "i" },
            },
          },
        ]
      : []),

    ...(email
      ? [
          {
            $match: {
              "user.email": { $regex: email, $options: "i" },
            },
          },
        ]
      : []),

    /* PRODUCT FILTER */
    ...(product
      ? [
          {
            $match: {
              "product.name": { $regex: product, $options: "i" },
            },
          },
        ]
      : []),

    { $sort: { createdAt: -1 } },

    {
      $facet: {
        data: [{ $skip: skip }, { $limit: parsedLimit }],
        totalCount: [{ $count: "count" }],
      },
    },
  ];

  const result = await Review.aggregate(pipeline);

  const data = result[0].data;
  const total = result[0].totalCount[0]?.count || 0;

  return {
    data,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
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
