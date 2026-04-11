const Contact = require("../models/contact.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE CONTACT ================= */
const createContact = async (data = {}) => {
  const contact = await Contact.create(data);
  return contact;
};

/* ================= GET ALL CONTACT ================= */
const getAllContacts = async (query = {}) => {
  const { page = 1, limit = 10, name, email, phone, subject, status } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  /* ================= FILTER ================= */
  const filter = {
    is_active: true,
  };

  /* NAME SEARCH */
  if (name) {
    filter.name = { $regex: name, $options: "i" };
  }

  /* EMAIL SEARCH */
  if (email) {
    filter.email = { $regex: email, $options: "i" };
  }

  /* PHONE SEARCH */
  if (phone) {
    filter.phone = { $regex: phone, $options: "i" };
  }

  /* SUBJECT SEARCH */
  if (subject) {
    filter.subject = { $regex: subject, $options: "i" };
  }

  /* STATUS FILTER */
  if (status) {
    filter.status = status; // unread | read | replied
  }

  /* ================= FETCH ================= */
  const [contacts, total] = await Promise.all([
    Contact.find(filter).sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),

    Contact.countDocuments(filter),
  ]);

  return {
    data: contacts,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET CONTACT ================= */
const getContactById = async (id = null) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, is_active: true },
    { status: "read" },
    { new: true },
  );
  if (!contact) {
    throw new Error(MESSAGES.CONTACT.NOT_FOUND);
  }
  return contact;
};

/* ================= REPLY CONTACT ================= */
const replyContact = async (id = null, data = {}) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, is_active: true },
    {
      reply_message: data.reply_message,
      status: "replied",
    },
    { new: true },
  );

  if (!contact) {
    throw new Error(MESSAGES.CONTACT.NOT_FOUND);
  }

  return contact;
};

/* ================= DELETE CONTACT ================= */
const deleteContact = async (id = null) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );

  if (!contact) {
    throw new Error(MESSAGES.CONTACT.NOT_FOUND);
  }
  return true;
};

module.exports = {
  createContact,
  getAllContacts,
  getContactById,
  replyContact,
  deleteContact,
};
