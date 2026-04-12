const Coupon = require("../models/coupon.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE COUPON ================= */

const createCoupon = async (data = {}) => {
  const existing = await Coupon.findOne({
    code: data.code,
    is_active: true,
  });

  if (existing) {
    throw new Error(MESSAGES.COUPON.ALREADY_EXISTS);
  }
  const coupon = await Coupon.create(data);
  return coupon;
};

/* ================= GET ALL COUPONS ================= */
const getAllCoupons = async (query = {}) => {
  const { page = 1, limit = 10, code, discount_type, expiry_date } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  /* ================= BASE FILTER ================= */
  const filter = {
    is_active: true,
  };

  /* ================= CODE SEARCH ================= */
  if (code) {
    filter.code = { $regex: code, $options: "i" }; // case-insensitive
  }

  /* ================= DISCOUNT TYPE FILTER ================= */
  if (discount_type) {
    filter.discount_type = discount_type; // percentage | flat
  }

  /* ================= EXPIRY DATE FILTER ================= */
  if (expiry_date) {
    // Filter coupons that expire on this date
    const start = new Date(expiry_date);
    const end = new Date(expiry_date);

    end.setHours(23, 59, 59, 999);

    filter.expiry_date = {
      $gte: start,
      $lte: end,
    };
  }

  /* ================= FETCH ================= */
  const [coupons, total] = await Promise.all([
    Coupon.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),

    Coupon.countDocuments(filter),
  ]);

  /* ================= RESPONSE ================= */
  return {
    data: coupons,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET COUPON BY ID ================= */
const getCouponById = async (id = null) => {
  const coupon = await Coupon.findOne({
    _id: id,
    is_active: true,
  });
  if (!coupon) {
    throw new Error(MESSAGES.COUPON.NOT_FOUND);
  }
  return coupon;
};

/* ================= UPDATE COUPON ================= */
const updateCoupon = async (id = null, data = {}) => {
  const coupon = await Coupon.findOneAndUpdate(
    { _id: id, is_active: true },
    data,
    { new: true },
  );
  if (!coupon) {
    throw new Error(MESSAGES.COUPON.NOT_FOUND);
  }
  return coupon;
};

/* ================= DELETE COUPON ================= */
const deleteCoupon = async (id = null) => {
  const coupon = await Coupon.findOneAndUpdate(
    { _id: id, is_active: true },
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );
  if (!coupon) {
    throw new Error(MESSAGES.COUPON.NOT_FOUND);
  }
  return true;
};

module.exports = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
