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
const getAllCoupons = async () => {
  const coupons = await Coupon.find({ is_active: true }).sort({
    created_at: -1,
  });
  return coupons;
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
