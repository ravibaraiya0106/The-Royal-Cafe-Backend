const DeliveryPerson = require("../models/deliveryPerson.model");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const sendEmail = require("../utils/sendMail");
const buildDeliveryWelcomeTemplate = require("../templates/deliveryWelcomeEmail.template");
const { MESSAGES } = require("../constants/constant");

/* ================= HELPER: ENSURE USER ACCOUNT FOR DELIVERY PERSON ================= */
const ensureUserForDeliveryPerson = async (person) => {
  if (!person) return null;

  if (person.user && person.user.username) {
    return person;
  }

  // If user field is ObjectId string or not populated
  if (person.user && typeof person.user === "object" && person.user._id) {
    const userDoc = await User.findById(person.user);
    if (userDoc) {
      person.user = userDoc;
      return person;
    }
  }

  // If user field is null or missing, create default user for existing delivery person
  const username = `delivery_${person.phone}`;
  const password = "123456";
  const recipientEmail = person.email || `${username}@royalcafe.com`;

  let userDoc = await User.findOne({
    $or: [{ username }, { phone_no: person.phone }],
  });

  if (!userDoc) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nameParts = (person.name || "").trim().split(" ");
    const firstName = nameParts[0] || "Delivery";
    const lastName = nameParts.slice(1).join(" ") || "Person";

    userDoc = await User.create({
      username,
      first_name: firstName,
      last_name: lastName,
      email: recipientEmail,
      phone_no: person.phone,
      password: hashedPassword,
      role: "delivery_person",
      is_active: true,
    });
  }

  person.user = userDoc._id;
  await person.save();

  person.user = userDoc;
  return person;
};

/* ================= CREATE DELIVERY PERSON ================= */

const createDeliveryPerson = async (data = {}) => {
  if (!data.phone || !data.phone.trim()) {
    throw new Error("Phone number is required");
  }

  if (!data.username || !data.username.trim()) {
    throw new Error("Username is required");
  }

  if (!data.password || !data.password.trim()) {
    throw new Error("Password is required");
  }

  const username = data.username.trim();
  const password = data.password.trim();

  const existingPhone = await DeliveryPerson.findOne({
    phone: data.phone,
    is_active: true,
  });

  if (existingPhone) {
    throw new Error(`Delivery person with phone number "${data.phone}" already exists.`);
  }

  const recipientEmail = data.email ? data.email.trim() : `${username}@royalcafe.com`;

  let userId = null;

  const existingUser = await User.findOne({
    $or: [{ username }, { email: recipientEmail }],
  });

  if (existingUser) {
    if (existingUser.role === "delivery_person") {
      const hashedPassword = await bcrypt.hash(password, 10);
      const nameParts = (data.name || "").trim().split(" ");
      const firstName = nameParts[0] || "Delivery";
      const lastName = nameParts.slice(1).join(" ") || "Person";

      existingUser.username = username;
      existingUser.email = recipientEmail;
      existingUser.password = hashedPassword;
      existingUser.first_name = firstName;
      existingUser.last_name = lastName;
      existingUser.phone_no = data.phone;
      await existingUser.save();

      userId = existingUser._id;
    } else {
      throw new Error(`Email "${recipientEmail}" or Username "${username}" is already registered to a customer/admin account.`);
    }
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const nameParts = (data.name || "").trim().split(" ");
    const firstName = nameParts[0] || "Delivery";
    const lastName = nameParts.slice(1).join(" ") || "Person";

    const user = await User.create({
      username,
      first_name: firstName,
      last_name: lastName,
      email: recipientEmail,
      phone_no: data.phone,
      password: hashedPassword,
      role: "delivery_person",
      is_active: true,
    });

    userId = user._id;
  }

  let deliveryPerson = await DeliveryPerson.findOne({ user: userId });
  if (deliveryPerson) {
    deliveryPerson.name = data.name;
    deliveryPerson.phone = data.phone;
    deliveryPerson.email = data.email || null;
    deliveryPerson.vehicle_type = data.vehicle_type || "bike";
    deliveryPerson.vehicle_number = data.vehicle_number || null;
    deliveryPerson.is_active = true;
    await deliveryPerson.save();
  } else {
    deliveryPerson = await DeliveryPerson.create({
      user: userId,
      name: data.name,
      phone: data.phone,
      email: data.email || null,
      vehicle_type: data.vehicle_type || "bike",
      vehicle_number: data.vehicle_number || null,
      current_location: data.current_location || null,
    });
  }

  try {
    const loginUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/delivery/login`;
    const html = buildDeliveryWelcomeTemplate(
      data.name,
      username,
      password,
      loginUrl,
    );
    await sendEmail(recipientEmail, "Welcome to Royal Cafe - Delivery Partner Credentials", html);
  } catch (emailErr) {
    console.error("Failed to send delivery partner welcome email:", emailErr);
  }

  return deliveryPerson;
};

/* ================= GET DELIVERY PERSONS ================= */

const getDeliveryPersons = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    name,
    phone,
    vehicle_type,
    vehicle_number,
    is_available,
  } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {
    is_active: true,
  };

  if (typeof is_available !== "undefined" && is_available !== "") {
    filter.is_available = is_available === "true" || is_available === true;
  }

  if (name) {
    const words = name.trim().split(/\s+/);
    filter.$and = words.map((word) => ({
      name: { $regex: word, $options: "i" },
    }));
  }

  if (phone) {
    filter.phone = { $regex: phone, $options: "i" };
  }

  if (vehicle_type) {
    filter.vehicle_type = vehicle_type.toLowerCase();
  }

  if (vehicle_number) {
    filter.vehicle_number = {
      $regex: vehicle_number,
      $options: "i",
    };
  }

  const [persons, total] = await Promise.all([
    DeliveryPerson.find(filter)
      .populate("user", "username role email phone_no")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),

    DeliveryPerson.countDocuments(filter),
  ]);

  const populatedData = persons.map((p) => {
    const obj = p.toObject();
    if (obj.user && typeof obj.user === "object" && obj.user.username) {
      obj.username = obj.user.username;
    }
    return obj;
  });

  return {
    data: populatedData,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET DELIVERY PERSON ================= */

const getDeliveryPerson = async (id = null) => {
  let person = await DeliveryPerson.findOne({
    _id: id,
    is_active: true,
  }).populate("user", "username role email phone_no");

  if (!person) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  person = await ensureUserForDeliveryPerson(person);

  const obj = person.toObject();
  if (obj.user && typeof obj.user === "object" && obj.user.username) {
    obj.username = obj.user.username;
  }

  return obj;
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

  await ensureUserForDeliveryPerson(person);

  // Update associated User account credentials if username/password updated
  if (person.user) {
    const userUpdates = {};
    if (data.username) userUpdates.username = data.username;
    if (data.email) userUpdates.email = data.email;
    if (data.phone) userUpdates.phone_no = data.phone;

    if (data.password && data.password.trim()) {
      userUpdates.password = await bcrypt.hash(data.password, 10);
    }

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(person.user._id || person.user, userUpdates);
    }
  }

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

  if (person.user) {
    await User.findByIdAndUpdate(person.user, { is_active: false });
  }

  return true;
};

module.exports = {
  createDeliveryPerson,
  getDeliveryPersons,
  getDeliveryPerson,
  updateDeliveryPerson,
  deleteDeliveryPerson,
};
