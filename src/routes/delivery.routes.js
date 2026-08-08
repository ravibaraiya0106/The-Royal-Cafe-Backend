const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const deliveryController = require("../controllers/delivery.controller");

/* ================= ASSIGN DELIVERY (ADMIN) ================= */
router.post("/assign", authMiddleware, deliveryController.assignDelivery);

/* ================= GET MY DELIVERIES (DELIVERY BOY) ================= */
router.get("/my-deliveries", authMiddleware, deliveryController.getMyDeliveries);

/* ================= GET DELIVERY DETAILS ================= */
router.get("/details/:id", authMiddleware, deliveryController.getDeliveryDetails);

/* ================= UPDATE DELIVERY STATUS ================= */
router.patch("/update-status/:id", authMiddleware, deliveryController.updateDeliveryStatus);

/* ================= TOGGLE AVAILABILITY ================= */
router.patch("/toggle-availability", authMiddleware, deliveryController.toggleAvailability);

/* ================= UPDATE LOCATION ================= */
router.patch("/update-location", authMiddleware, deliveryController.updateLocation);

/* ================= ADMIN DELIVERY LIST ================= */
router.get("/admin/list", authMiddleware, deliveryController.getAdminDeliveries);

/* ================= DELIVERY ANALYTICS ================= */
router.get("/analytics", authMiddleware, deliveryController.getDeliveryAnalytics);

module.exports = router;
