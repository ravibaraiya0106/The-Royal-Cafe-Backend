const Product = require("../models/product.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE PRODUCT ================= */

const createProduct = async (data = {}) => {
  const { name, category } = data;

  const existing = await Product.findOne({
    name,
    category,
    deleted_at: null,
  });

  if (existing) {
    throw new Error(MESSAGES.PRODUCT.ALREADY_EXISTS);
  }

  const product = await Product.create(data);

  return product;
};

/* ================= GET ALL PRODUCTS ================= */

const getAllProducts = async () => {
  const products = await Product.find({
    deleted_at: null,
  })
    .populate("category", "name")
    .sort({ createdAt: -1 });

  return products;
};

/* ================= GET PRODUCT BY ID ================= */

const getProductById = async (id) => {
  const product = await Product.findOne({
    _id: id,
    deleted_at: null,
  }).populate("category", "name");

  if (!product) {
    throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
  }

  return product;
};

/* ================= UPDATE PRODUCT ================= */

const updateProduct = async (id, data = {}) => {
  const product = await Product.findOneAndUpdate(
    { _id: id, deleted_at: null },
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
    { _id: id, deleted_at: null },
    { deleted_at: new Date() },
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
