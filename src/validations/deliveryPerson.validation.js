const Joi = require("joi");

/* ================= CREATE ================= */

exports.createDeliveryPersonValidation = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().allow(null, ""),
  username: Joi.string().required(),
  password: Joi.string().required(),
  vehicle_type: Joi.string().valid("bike", "cycle", "scooter").allow(null, ""),
  vehicle_number: Joi.string().allow(null, ""),
  current_location: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
  }).optional(),
});

/* ================= UPDATE ================= */

exports.updateDeliveryPersonValidation = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email().allow(null, ""),
  username: Joi.string().allow(null, ""),
  password: Joi.string().allow(null, ""),
  vehicle_type: Joi.string().valid("bike", "cycle", "scooter").allow(null, ""),
  vehicle_number: Joi.string().allow(null, ""),
  is_available: Joi.boolean(),
  is_active: Joi.boolean(),
  current_location: Joi.object({
    lat: Joi.number(),
    lng: Joi.number(),
  }).optional(),
});
