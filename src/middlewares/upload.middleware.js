const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PATHS } = require("../constants/constant");

/* Ensure upload folder exists */
if (!fs.existsSync(PATHS.CATEGORY_IMAGE_UPLOAD)) {
  fs.mkdirSync(PATHS.CATEGORY_IMAGE_UPLOAD, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PATHS.CATEGORY_IMAGE_UPLOAD);
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + path.extname(file.originalname);
    cb(null, fileName);
  },
});

const uploadCategoryImage = multer({ storage });

module.exports = { uploadCategoryImage };
