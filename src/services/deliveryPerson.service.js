const DeliveryPerson = require("../models/deliveryPerson.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE DELIVERY PERSON ================= */

const createDeliveryPerson = async (data = {}) => {
  const existing = await DeliveryPerson.findOne({
    phone: data.phone,
    is_active: true,
  });

  if (existing) {
    throw new Error(MESSAGES.DELIVERY_PERSON.ALREADY_EXISTS);
  }

  const deliveryPerson = await DeliveryPerson.create({
    name: data.name,
    phone: data.phone,
    email: data.email || null,
    vehicle_type: data.vehicle_type || "bike",
    vehicle_number: data.vehicle_number || null,
    current_location: data.current_location || null,
  });

  return deliveryPerson;
};

/* ================= GET DELIVERY PERSONS ================= */

const getDeliveryPersons = async (query = {}) => {
  const {
    page = 1,
    limit = 5,
    name,
    phone,
    vehicle_type,
    vehicle_number,
  } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  /* ================= BASE FILTER ================= */
  const filter = {
    is_active: true,
  };

  /* ================= NAME SEARCH ================= */
  if (name) {
    const words = name.trim().split(/\s+/);

    filter.$and = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));
  }

  /* ================= PHONE SEARCH ================= */
  if (phone) {
    filter.phone = { $regex: phone, $options: "i" };
  }

  /* ================= VEHICLE TYPE ================= */
  if (vehicle_type) {
    filter.vehicle_type = vehicle_type.toLowerCase();
  }

  /* ================= VEHICLE NUMBER ================= */
  if (vehicle_number) {
    filter.vehicle_number = {
      $regex: vehicle_number,
      $options: "i",
    };
  }

  /* ================= QUERY ================= */
  const [persons, total] = await Promise.all([
    DeliveryPerson.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),

    DeliveryPerson.countDocuments(filter),
  ]);

  /* ================= RESPONSE ================= */
  return {
    data: persons,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET DELIVERY PERSON ================= */

const getDeliveryPerson = async (id = null) => {
  const person = await DeliveryPerson.findOne({
    _id: id,
    is_active: true,
  });

  if (!person) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  return person;
};

/* ================= UPDATE DELIVERY PERSON ================= */

const updateDeliveryPerson = async (id = null, data = {}) => {
  const person = await DeliveryPerson.findOne({
    _id: id,
    is_active: true,
  });

  if (!person) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  if (data.name) person.name = data.name;
  if (data.phone) person.phone = data.phone;
  if (data.email) person.email = data.email;
  if (data.vehicle_type) person.vehicle_type = data.vehicle_type;
  if (data.vehicle_number) person.vehicle_number = data.vehicle_number;
  if (data.current_location) person.current_location = data.current_location;
  if (typeof data.is_available === "boolean")
    person.is_available = data.is_available;

  await person.save();

  return person;
};

/* ================= DELETE DELIVERY PERSON ================= */

const deleteDeliveryPerson = async (id = null) => {
  const person = await DeliveryPerson.findOne({
    _id: id,
    is_active: true,
  });

  if (!person) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  person.is_active = false;
  person.deleted_at = new Date();

  await person.save();

  return true;
};

module.exports = {
  createDeliveryPerson,
  getDeliveryPersons,
  getDeliveryPerson,
  updateDeliveryPerson,
  deleteDeliveryPerson,
};
