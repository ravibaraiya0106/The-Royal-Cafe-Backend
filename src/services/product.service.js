const Product = require("../models/product.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE PRODUCT ================= */

const createProduct = async (data = {}) => {
  const { name, category } = data;

  const existing = await Product.findOne({
    name,
    category,
    is_active: true,
  });

  if (existing) {
    throw new Error(MESSAGES.PRODUCT.ALREADY_EXISTS);
  }

  const product = await Product.create(data);

  return product;
};

/* ================= GET ALL PRODUCTS ================= */

const getAllProducts = async () => {
  const products = await Product.find({ is_active: true })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  return products;
};

/* ================= GET PRODUCT BY ID ================= */

const getProductById = async (id) => {
  const product = await Product.findOne({
    _id: id,
    is_active: true,
  }).populate("category", "name");

  if (!product) {
    throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
  }

  return product;
};

/* ================= UPDATE PRODUCT ================= */

const updateProduct = async (id, data = {}) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, is_active: true },
    data,
    { new: true },
  );

  if (!product) {
    throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
  }

  return product;
};

/* ================= DELETE PRODUCT ================= */

const deleteProduct = async (id) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, is_active: true },
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );

  if (!product) {
    throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
  }

  return product;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
