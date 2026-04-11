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

const getAllProducts = async (query) => {
  const { page = 1, limit = 10, name, category, is_special } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {
    is_active: true,
  };

  if (name) {
    const words = name.trim().split(/\s+/);

    filter.$and = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));
  }

  if (category) {
    filter.category = category; // expect category ID
  }

  if (is_special !== undefined && is_special !== "") {
    filter.is_special = is_special === "true";
  }

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),

    Product.countDocuments(filter),
  ]);

  return {
    data: products,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
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
