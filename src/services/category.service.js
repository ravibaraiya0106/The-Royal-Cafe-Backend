const Category = require("../models/category.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE CATEGORY ================= */

const createCategory = async (data = {}) => {
  console.log("➡️ Service: createCategory called");

  const { name } = data;
  console.log("📦 Category Name:", name);

  const existing = await Category.findOne({
    name,
    deleted_at: null,
    is_active: true,
  });

  console.log("🔎 Existing Category:", existing);

  if (existing) {
    console.log("⚠️ Category already exists");
    throw new Error(MESSAGES.CATEGORY.ALREADY_EXISTS);
  }

  console.log("💾 Creating category in database...");

  const category = await Category.create(data);

  console.log("✅ Category saved:", category);

  return category;
};

/* ================= GET ALL CATEGORY ================= */

const getAllCategories = async () => {
  const categories = await Category.find({ deleted_at: null, is_active: true });

  return categories;
};

/* ================= GET SINGLE CATEGORY ================= */

const getCategoryById = async (id = null) => {
  const category = await Category.findOne({
    _id: id,
    deleted_at: null,
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
    { _id: id, deleted_at: null, is_active: true },
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
};
