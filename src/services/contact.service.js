const Contact = require("../models/contact.model");
const { MESSAGES } = require("../constants/constant");

/* ================= CREATE CONTACT ================= */
const createContact = async (data = {}) => {
  const contact = await Contact.create(data);
  return contact;
};

/* ================= GET ALL CONTACT ================= */
const getAllContacts = async () => {
  const contacts = await Contact.find({
    deleted_at: null,
    is_active: true,
  }).sort({ createdAt: -1 });
  return contacts;
};

/* ================= GET CONTACT ================= */
const getContactById = async (id = null) => {
  const contact = await Contact.findOneAndUpdate(
    { _id: id, deleted_at: null, is_active: true },
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
    { _id: id, deleted_at: null, is_active: true },
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
