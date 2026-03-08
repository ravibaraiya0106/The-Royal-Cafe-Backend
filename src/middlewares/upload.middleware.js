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

const uploadCategoryImage = multer({ categoryImageStorage });
const uploadProductImage = multer({ productImageStorage });

module.exports = { uploadCategoryImage, uploadProductImage };
