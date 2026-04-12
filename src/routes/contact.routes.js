const express = require("express");
const router = express.Router();

const contactController = require("../controllers/contact.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");
const multer = require("multer");
const upload = multer();

const {
  createContactValidation,
  replyContactValidation,
} = require("../validations/contact.validation");

/* ================= CREATE CONTACT ================= */
router.post(
  "/create",
  upload.none(),
  validate(createContactValidation),
  contactController.createContact,
);

/* ================= GET ALL CONTACT ================= */
router.get("/list", authMiddleware, contactController.getAllContacts);

/* ================= GET CONTACT ================= */
router.get("/:id", authMiddleware, contactController.getContact);

/* ================= REPLY CONTACT ================= */
router.put(
  "/reply/:id",
  upload.none(),
  authMiddleware,
  validate(replyContactValidation),
  contactController.replyContact,
);

/* ================= DELETE CONTACT ================= */
router.delete("/delete/:id", authMiddleware, contactController.deleteContact);

module.exports = router;
