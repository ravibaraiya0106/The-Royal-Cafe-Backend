const Blog = require("../models/blog.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE ================= */
const createBlog = async (data = {}) => {
  const blog = await Blog.create(data);
  return blog;
};

/* ================= GET ALL ================= */
const getAllBlogs = async (query = {}) => {
  const { page = 1, limit = 10, title } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {
    is_active: true,
  };

  if (title) {
    const words = title.trim().split(/\s+/);
    filter.$and = words.map((word) => ({
      title: { $regex: word, $options: "i" },
    }));
  }

  const [blogs, total] = await Promise.all([
    Blog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),

    Blog.countDocuments(filter),
  ]);

  return {
    data: blogs,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET BY ID ================= */
const getBlogById = async (id) => {
  const blog = await Blog.findOne({
    _id: id,
    is_active: true,
  });

  if (!blog) throw new Error(MESSAGES.BLOG.NOT_FOUND);

  return blog;
};

/* ================= UPDATE ================= */
const updateBlog = async (id, data = {}) => {
  const blog = await Blog.findOneAndUpdate({ _id: id, is_active: true }, data, {
    new: true,
  });

  if (!blog) throw new Error(MESSAGES.BLOG.NOT_FOUND);

  return blog;
};

/* ================= DELETE ================= */
const deleteBlog = async (id) => {
  const blog = await Blog.findByIdAndUpdate(
    id,
    { is_active: false, deleted_at: new Date() },
    { new: true },
  );

  if (!blog) throw new Error(MESSAGES.BLOG.NOT_FOUND);

  return true;
};

module.exports = {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
  deleteBlog,
};
