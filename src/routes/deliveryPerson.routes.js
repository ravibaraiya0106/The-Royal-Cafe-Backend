const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const deliveryPersonController = require("../controllers/deliveryPerson.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
  createDeliveryPersonValidation,
  updateDeliveryPersonValidation,
} = require("../validations/deliveryPerson.validation");

/* ================= CREATE DELIVERY PERSON ================= */

router.post(
  "/create",
  authMiddleware,
  upload.none(),
  validate(createDeliveryPersonValidation),
  deliveryPersonController.createDeliveryPerson,
);

/* ================= GET ALL DELIVERY PERSONS ================= */

router.get(
  "/list",
  authMiddleware,
  deliveryPersonController.getDeliveryPersons,
);

/* ================= GET DELIVERY PERSON BY ID ================= */

router.get("/:id", authMiddleware, deliveryPersonController.getDeliveryPerson);

/* ================= UPDATE DELIVERY PERSON ================= */

router.put(
  "/update/:id",
  authMiddleware,
  upload.none(),
  validate(updateDeliveryPersonValidation),
  deliveryPersonController.updateDeliveryPerson,
);

/* ================= DELETE DELIVERY PERSON ================= */

router.delete(
  "/delete/:id",
  authMiddleware,
  deliveryPersonController.deleteDeliveryPerson,
);

module.exports = router;
