const crypto = require("crypto");
const { MESSAGES } = require("../constants/constant");

const getRazorpayInstance = () => {
  const Razorpay = require("razorpay");
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error(MESSAGES.PAYMENT.RAZORPAY_NOT_CONFIGURED);
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};

/* ================= CREATE RAZORPAY ORDER ================= */
const createRazorpayOrder = async ({
  amount,
  currency = "INR",
  receipt,
  notes = {},
}) => {
  if (!amount || Number(amount) <= 0) {
    throw new Error(MESSAGES.PAYMENT.AMOUNT_REQUIRED);
  }

  const razorpay = getRazorpayInstance();

  const options = {
    amount: Math.round(Number(amount) * 100),
    currency,
    receipt: receipt || `receipt-${Date.now()}`,
    notes,
  };

  const order = await razorpay.orders.create(options);
  return order;
};

/* ================= VERIFY RAZORPAY SIGNATURE ================= */
const verifyRazorpaySignature = ({
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) => {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    throw new Error(MESSAGES.PAYMENT.RAZORPAY_NOT_CONFIGURED);
  }

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return false;
  }

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(body.toString())
    .digest("hex");

  return expectedSignature === razorpay_signature;
};

/* ================= FETCH RAZORPAY PAYMENT DETAILS ================= */
const fetchRazorpayPayment = async (paymentId) => {
  if (!paymentId) {
    throw new Error(MESSAGES.PAYMENT.RAZORPAY_PAYMENT_ID_REQUIRED);
  }
  const razorpay = getRazorpayInstance();
  const payment = await razorpay.payments.fetch(paymentId);
  return payment;
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpaySignature,
  fetchRazorpayPayment,
};
