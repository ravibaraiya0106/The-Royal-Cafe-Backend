const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PATHS } = require("../constants/constant");

/* Ensure upload folder exists */
if (!fs.existsSync(PATHS.CATEGORY_IMAGE_UPLOAD)) {
  fs.mkdirSync(PATHS.CATEGORY_IMAGE_UPLOAD, { recursive: true });
}

if (!fs.existsSync(PATHS.PRODUCT_IMAGE_UPLOAD)) {
  fs.mkdirSync(PATHS.PRODUCT_IMAGE_UPLOAD, { recursive: true });
}

if (!fs.existsSync(PATHS.BLOG_IMAGE_UPLOAD)) {
  fs.mkdirSync(PATHS.BLOG_IMAGE_UPLOAD, { recursive: true });
}

const categoryImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATHS.CATEGORY_IMAGE_UPLOAD);
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATHS.PRODUCT_IMAGE_UPLOAD);
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const blogImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATHS.BLOG_IMAGE_UPLOAD);
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});
const uploadCategoryImage = multer({ storage: categoryImageStorage });
const uploadProductImage = multer({ storage: productImageStorage });
const uploadBlogImage = multer({ storage: blogImageStorage });

module.exports = { uploadCategoryImage, uploadProductImage, uploadBlogImage };
