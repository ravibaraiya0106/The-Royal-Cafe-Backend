const crypto = require("crypto");
const paymentService = require("../services/payment.service");
const { sendResponse } = require("../utils/response");
const { SUCCESS, STATUS_CODES, MESSAGES } = require("../constants/constant");

/* ================= CREATE RAZORPAY ORDER ================= */
const createRazorpayOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount, currency = "INR", notes = {} } = req.body;

    const order = await paymentService.createRazorpayOrder({
      amount: Number(amount),
      currency,
      receipt: `RC-${userId}-${Date.now()}`,
      notes: { userId, ...notes },
    });

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PAYMENT.RAZORPAY_ORDER_SUCCESS,
      data: {
        id: order.id,
        entity: order.entity,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
        status: order.status,
        amount_paid: order.amount_paid,
        notes: order.notes,
        created_at: order.created_at,
        key_id: process.env.RAZORPAY_KEY_ID,
      },
      statusCode: STATUS_CODES.CREATED,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= VERIFY RAZORPAY PAYMENT ================= */
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const isValid = paymentService.verifyRazorpaySignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isValid) {
      return sendResponse(res, {
        success: SUCCESS.NO,
        message: MESSAGES.PAYMENT.RAZORPAY_VERIFY_FAILED,
        data: null,
        statusCode: STATUS_CODES.BAD_REQUEST,
      });
    }

    return sendResponse(res, {
      success: SUCCESS.YES,
      message: MESSAGES.PAYMENT.RAZORPAY_VERIFY_SUCCESS,
      data: {
        verified: true,
        razorpay_order_id,
        razorpay_payment_id,
      },
      statusCode: STATUS_CODES.OK,
    });
  } catch (error) {
    return sendResponse(res, {
      success: SUCCESS.NO,
      message: error.message || MESSAGES.COMMON.SERVER_ERROR,
      statusCode: STATUS_CODES.BAD_REQUEST,
    });
  }
};

/* ================= RAZORPAY WEBHOOK ================= */
const razorpayWebhook = async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers["x-razorpay-signature"];

    if (webhookSecret && signature) {
      const body = req.body;
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body.toString())
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).send("Invalid webhook signature");
      }
    }

    let parsedBody;
    try {
      parsedBody =
        typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).send("Invalid webhook payload");
    }

    const event = parsedBody.event;
    const payload = parsedBody.payload;

    if (event === "payment.captured" && payload?.payment) {
      console.log(
        `[Razorpay Webhook] Payment captured: ${payload.payment.entity.id}`,
      );
    } else if (event === "payment.failed" && payload?.payment) {
      console.log(
        `[Razorpay Webhook] Payment failed: ${payload.payment.entity.id}`,
      );
    }

    res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("[Razorpay Webhook] Error:", error.message);
    res.status(500).json({ error: "Webhook processing failed" });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  razorpayWebhook,
};
