const Category = require("../models/category.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE CATEGORY ================= */

const createCategory = async (data = {}) => {
  const { name } = data;

  const existing = await Category.findOne({
    name,
    is_active: true,
  });

  if (existing) {
    throw new Error(MESSAGES.CATEGORY.ALREADY_EXISTS);
  }

  const category = await Category.create(data);

  return category;
};

/* ================= GET ALL CATEGORY ================= */

const getAllCategories = async (query = {}) => {
  const { page = 1, limit = 10, name } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  const filter = { is_active: true };

  // Name search (multi-word search)
  if (name) {
    const words = name.trim().split(/\s+/);

    filter.$and = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));
  }

  const [categories, total] = await Promise.all([
    Category.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),

    Category.countDocuments(filter),
  ]);

  return {
    data: categories,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET CATEGORY DROPDOWN ================= */

const getCategoryDropdown = async () => {
  const categories = await Category.find({ is_active: true }, { name: 1 });

  return categories;
};

/* ================= GET SINGLE CATEGORY ================= */

const getCategoryById = async (id = null) => {
  const category = await Category.findOne({
    _id: id,
    is_active: true,
  });

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return category;
};

/* ================= UPDATE CATEGORY ================= */

const updateCategory = async (id = null, data = {}) => {
  const category = await Category.findOneAndUpdate(
    { _id: id, is_active: true },
    data,
    { new: true },
  );

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return category;
};

/* ================= DELETE CATEGORY (SOFT DELETE) ================= */

const deleteCategory = async (id = null) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );

  if (!category) {
    throw new Error(MESSAGES.CATEGORY.NOT_FOUND);
  }

  return true;
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getCategoryDropdown,
};
