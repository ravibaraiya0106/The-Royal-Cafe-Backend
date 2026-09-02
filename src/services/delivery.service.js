const Delivery = require("../models/delivery.model");
const DeliveryPerson = require("../models/deliveryPerson.model");
const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Payment = require("../models/payment.model");
const OrderStatusHistory = require("../models/orderStatusHistory.model");
const User = require("../models/user.model");
const { MESSAGES } = require("../constants/constant");
const { getIO } = require("../config/socket");
const sendEmail = require("../utils/sendMail");
const buildDeliveryAssignmentTemplate = require("../templates/deliveryAssignmentEmail.template");

/* ================= HELPER: GET DELIVERY PERSON BY USER ID ================= */
const getDeliveryPersonByUser = async (userId) => {
  let dp = await DeliveryPerson.findOne({ user: userId, is_active: true });
  if (!dp) {
    dp = await DeliveryPerson.findOne({ _id: userId, is_active: true });
  }
  return dp;
};

/* ================= ASSIGN DELIVERY (ADMIN) ================= */
const assignDelivery = async (data = {}) => {
  const { orderId, deliveryPersonId, notes = "" } = data;

  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error("Order not found");
  }

  if (order.order_status === "cancelled") {
    throw new Error("Cannot assign delivery to a cancelled order");
  }

  const deliveryPerson = await DeliveryPerson.findOne({
    _id: deliveryPersonId,
    is_active: true,
  }).populate("user", "email username phone_no");

  if (!deliveryPerson) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  let delivery = await Delivery.findOne({ order: orderId });

  if (delivery) {
    delivery.delivery_person = deliveryPersonId;
    delivery.delivery_status = "assigned";
    if (notes) delivery.notes = notes;
    await delivery.save();
  } else {
    delivery = await Delivery.create({
      order: orderId,
      delivery_person: deliveryPersonId,
      delivery_status: "assigned",
      notes,
    });
  }

  if (order.order_status === "pending") {
    order.order_status = "confirmed";
    await order.save();
  }

  await OrderStatusHistory.create({
    order: orderId,
    status: "delivery_assigned",
    changed_at: new Date(),
  });

  const populatedDelivery = await Delivery.findById(delivery._id)
    .populate("order")
    .populate("delivery_person");

  // 🔔 REAL-TIME SOCKET NOTIFICATION
  try {
    const io = getIO();
    const notificationPayload = {
      event: "new_delivery_assigned",
      deliveryId: delivery._id,
      orderId: order._id,
      orderNumber: order.order_number,
      finalAmount: order.final_amount,
      paymentMethod: order.payment_method,
      address: order.deliveryLocation?.address || "",
      phone: order.phone,
      notes: notes || "",
      assignedAt: new Date().toISOString(),
    };

    // Emit to specific delivery person rooms
    io.to(`delivery_person:${deliveryPerson._id}`).emit(
      "new_delivery_assigned",
      notificationPayload,
    );
    if (deliveryPerson.user) {
      const dpUserId = typeof deliveryPerson.user === "object" ? deliveryPerson.user._id : deliveryPerson.user;
      io.to(`delivery_person:${dpUserId}`).emit(
        "new_delivery_assigned",
        notificationPayload,
      );
      io.to(`user:${dpUserId}`).emit(
        "new_delivery_assigned",
        notificationPayload,
      );
    }
  } catch (socketErr) {
    console.error("Socket notification error on delivery assignment:", socketErr?.message || socketErr);
  }

  // 📧 SEND EMAIL NOTIFICATION TO DELIVERY PERSON
  try {
    const recipientEmail =
      deliveryPerson.email ||
      (typeof deliveryPerson.user === "object" ? deliveryPerson.user.email : null);

    if (recipientEmail) {
      const html = buildDeliveryAssignmentTemplate({
        deliveryPersonName: deliveryPerson.name,
        orderNumber: order.order_number,
        totalAmount: order.final_amount,
        paymentMethod: order.payment_method,
        address: order.deliveryLocation?.address || "Customer address",
        phone: order.phone,
        notes,
      });

      await sendEmail(
        recipientEmail,
        `🛵 New Order Assignment - #${order.order_number} | The Royal Cafe`,
        html,
      );
    }
  } catch (emailErr) {
    console.error("Email notification error on delivery assignment:", emailErr?.message || emailErr);
  }

  return populatedDelivery;
};

/* ================= GET MY DELIVERIES (DELIVERY BOY) ================= */
const getMyDeliveries = async (userId, query = {}) => {
  const dp = await getDeliveryPersonByUser(userId);
  if (!dp) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  const { page = 1, limit = 10, status } = query;
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.max(1, Number(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = { delivery_person: dp._id };

  if (status) {
    if (status === "active") {
      filter.delivery_status = { $in: ["assigned", "picked", "out_for_delivery"] };
    } else if (status === "completed") {
      filter.delivery_status = "delivered";
    } else {
      filter.delivery_status = status;
    }
  }

  const [deliveries, total] = await Promise.all([
    Delivery.find(filter)
      .sort({ createdAt: -1 })
      .populate({
        path: "order",
        populate: {
          path: "user",
          select: "first_name last_name email phone_no",
        },
      })
      .skip(skip)
      .limit(parsedLimit),
    Delivery.countDocuments(filter),
  ]);

  const populatedDeliveries = await Promise.all(
    deliveries.map(async (item) => {
      const deliveryObj = item.toObject();
      if (deliveryObj.order && deliveryObj.order._id) {
        const items = await OrderItem.find({ order: deliveryObj.order._id }).select(
          "product_name price quantity subtotal",
        );
        deliveryObj.order.items = items;
      }
      return deliveryObj;
    }),
  );

  return {
    delivery_person: dp,
    data: populatedDeliveries,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= GET DELIVERY DETAILS ================= */
const getDeliveryDetails = async (deliveryId, userId = null) => {
  const delivery = await Delivery.findById(deliveryId)
    .populate({
      path: "order",
      populate: {
        path: "user",
        select: "first_name last_name email phone_no",
      },
    })
    .populate("delivery_person");

  if (!delivery) {
    throw new Error(MESSAGES.DELIVERY.NOT_FOUND);
  }

  if (userId) {
    const dp = await getDeliveryPersonByUser(userId);
    if (dp && String(delivery.delivery_person._id) !== String(dp._id)) {
      throw new Error(MESSAGES.DELIVERY.NOT_AUTHORIZED);
    }
  }

  const deliveryObj = delivery.toObject();
  if (deliveryObj.order && deliveryObj.order._id) {
    const items = await OrderItem.find({ order: deliveryObj.order._id });
    deliveryObj.order.items = items;
  }

  return deliveryObj;
};

/* ================= UPDATE DELIVERY STATUS ================= */
const updateDeliveryStatus = async (deliveryId, userId, data = {}) => {
  const { status, cash_collected = 0, notes = "" } = data;

  const dp = await getDeliveryPersonByUser(userId);
  if (!dp) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  const delivery = await Delivery.findOne({
    _id: deliveryId,
    delivery_person: dp._id,
  }).populate("order");

  if (!delivery) {
    throw new Error(MESSAGES.DELIVERY.NOT_FOUND);
  }

  delivery.delivery_status = status;
  if (notes) delivery.notes = notes;

  const order = await Order.findById(delivery.order._id);

  if (status === "picked") {
    delivery.pickup_at = new Date();
    if (order) {
      order.order_status = "preparing";
      await order.save();
    }
  } else if (status === "out_for_delivery") {
    if (order) {
      order.order_status = "preparing";
      await order.save();
    }
  } else if (status === "delivered") {
    delivery.delivered_at = new Date();
    delivery.cash_collected = Number(cash_collected) || order.final_amount;

    if (order) {
      order.order_status = "delivered";
      if (order.payment_method === "COD") {
        order.payment_status = "paid";
      }
      await order.save();

      await Payment.findOneAndUpdate(
        { order: order._id },
        {
          payment_status: "paid",
          paid_at: new Date(),
        },
      );
    }

    dp.is_available = true;
    await dp.save();
    if (order) {
      order.deliveryTracking = order.deliveryTracking || {};
      order.deliveryTracking.isOnline = false;
      await order.save();
    }
  } else if (status === "cancelled") {
    if (order) {
      order.order_status = "cancelled";
      order.deliveryTracking = order.deliveryTracking || {};
      order.deliveryTracking.isOnline = false;
      await order.save();
    }
  }

  await delivery.save();

  await OrderStatusHistory.create({
    order: delivery.order._id,
    status: `delivery_${status}`,
    changed_at: new Date(),
  });

  // Broadcast status updates for customer tracking UI.
  try {
    const io = getIO();
    const orderId = delivery.order._id;

    const mapStatusForFrontend = () => {
      if (status === "picked") return "preparing";
      if (status === "out_for_delivery") return "out_for_delivery";
      if (status === "delivered") return "delivered";
      if (status === "cancelled") return "cancelled";
      return status;
    };

    io.to(`order:${orderId}`).emit("order:status_update", {
      orderId,
      status: mapStatusForFrontend(),
    });
  } catch (e) {
    // Socket may not be ready in tests/dev; ignore.
    console.log("order:status_update broadcast failed:", e?.message || e);
  }

  return delivery;
};

/* ================= TOGGLE AVAILABILITY ================= */
const toggleAvailability = async (userId, isAvailable) => {
  const dp = await getDeliveryPersonByUser(userId);
  if (!dp) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  dp.is_available = typeof isAvailable === "boolean" ? isAvailable : !dp.is_available;
  await dp.save();
  return dp;
};

/* ================= UPDATE LOCATION ================= */
const updateLocation = async (userId, lat, lng) => {
  const dp = await getDeliveryPersonByUser(userId);
  if (!dp) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  dp.current_location = { lat: Number(lat), lng: Number(lng) };
  await dp.save();
  return dp;
};

/* ================= GET ALL DELIVERIES (ADMIN) ================= */
const getAdminDeliveries = async (query = {}) => {
  const { page = 1, limit = 10, delivery_status, delivery_person } = query;
  const parsedPage = Math.max(1, Number(page) || 1);
  const parsedLimit = Math.max(1, Number(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;

  const filter = {};
  if (delivery_status) filter.delivery_status = delivery_status;
  if (delivery_person) filter.delivery_person = delivery_person;

  const [deliveries, total] = await Promise.all([
    Delivery.find(filter)
      .sort({ createdAt: -1 })
      .populate("order")
      .populate("delivery_person")
      .skip(skip)
      .limit(parsedLimit),
    Delivery.countDocuments(filter),
  ]);

  return {
    data: deliveries,
    total,
    page: parsedPage,
    limit: parsedLimit,
    totalPages: Math.ceil(total / parsedLimit),
  };
};

/* ================= DELIVERY ANALYTICS & STATS ================= */
const getDeliveryAnalytics = async (userId) => {
  const dp = await getDeliveryPersonByUser(userId);
  if (!dp) {
    throw new Error(MESSAGES.DELIVERY_PERSON.NOT_FOUND);
  }

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const [statusBreakdownAgg, dailyCompletedAgg, cashCollectedAgg] = await Promise.all([
    Delivery.aggregate([
      { $match: { delivery_person: dp._id } },
      { $group: { _id: "$delivery_status", count: { $sum: 1 } } },
    ]),
    Delivery.aggregate([
      {
        $match: {
          delivery_person: dp._id,
          delivery_status: "delivered",
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          completed: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Delivery.aggregate([
      { $match: { delivery_person: dp._id, delivery_status: "delivered" } },
      { $group: { _id: null, totalCash: { $sum: "$cash_collected" } } },
    ]),
  ]);

  const statusMap = {};
  statusBreakdownAgg.forEach((item) => {
    statusMap[item._id] = item.count;
  });

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const trendMap = {};
  dailyCompletedAgg.forEach((item) => {
    trendMap[item._id] = item.completed;
  });

  const performanceTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLabel = dayNames[d.getDay()];

    performanceTrend.push({
      label: dayLabel,
      date: dateStr,
      value: trendMap[dateStr] || 0,
    });
  }

  return {
    statusBreakdown: statusMap,
    performanceTrend,
    totalCashCollected: cashCollectedAgg[0]?.totalCash || 0,
    isAvailable: dp.is_available,
  };
};

module.exports = {
  assignDelivery,
  getMyDeliveries,
  getDeliveryDetails,
  updateDeliveryStatus,
  toggleAvailability,
  updateLocation,
  getAdminDeliveries,
  getDeliveryAnalytics,
};
