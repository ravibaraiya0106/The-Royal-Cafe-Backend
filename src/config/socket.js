const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;
const BlacklistToken = require("../models/blacklistToken.model");
const DeliveryPerson = require("../models/deliveryPerson.model");
const Order = require("../models/order.model");
const Delivery = require("../models/delivery.model");

const isValidLatLng = (latitude, longitude) => {
  const lat = Number(latitude);
  const lon = Number(longitude);
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
};

const getDeliveryPersonByUser = async (userId) => {
  // Mirrors the REST logic in delivery.service.
  let dp = await DeliveryPerson.findOne({ user: userId, is_active: true });
  if (!dp) {
    dp = await DeliveryPerson.findOne({ _id: userId, is_active: true });
  }
  return dp;
};

const authenticateSocket = async (socket) => {
  const token = socket.handshake?.auth?.token;
  if (!token) return null;

  const blacklisted = await BlacklistToken.findOne({ token });
  if (blacklisted) return null;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const decoded = await authenticateSocket(socket);
      if (!decoded) return next(new Error("UNAUTHORIZED"));
      socket.user = decoded; // { id, role }
      return next();
    } catch {
      return next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected to Socket.IO: ${socket.id}`);

    const { id: userId, role } = socket.user || {};
    if (userId) {
      socket.join(`user:${userId}`);
    }
    if (role === "delivery_person" && userId) {
      getDeliveryPersonByUser(userId)
        .then((dp) => {
          if (dp) {
            socket.join(`delivery_person:${dp._id}`);
            socket.join(`delivery_person:${userId}`);
          }
        })
        .catch(() => {});
    }

    // Join order-specific room or role room
    socket.on("join_order", async (orderId) => {
      try {
        if (!orderId) return;
        const { id: userId, role } = socket.user || {};
        if (!userId || !role) return;

        const room = `order:${orderId}`;

        if (role === "admin") {
          socket.join(room);
          return;
        }

        if (role === "user") {
          const order = await Order.findById(orderId).select("user");
          if (!order) return;
          if (String(order.user) !== String(userId)) return;
          socket.join(room);
          return;
        }

        if (role === "delivery_person") {
          const dp = await getDeliveryPersonByUser(userId);
          if (!dp) return;
          const delivery = await Delivery.findOne({
            order: orderId,
            delivery_person: dp._id,
          }).select("_id");
          if (!delivery) return;
          socket.join(room);
          return;
        }
      } catch (e) {
        // Avoid leaking internal errors to the client.
        console.log("join_order failed:", e?.message || e);
      }
    });

    socket.on("leave_order", (orderId) => {
      socket.leave(`order:${orderId}`);
    });

    const handleDeliveryLocationUpdate = async ({ orderId, latitude, longitude }) => {
      try {
        const { id: userId, role } = socket.user || {};
        if (role !== "delivery_person") return;
        if (!orderId) return;

        if (!isValidLatLng(latitude, longitude)) return;

        const dp = await getDeliveryPersonByUser(userId);
        if (!dp) return;

        // Never trust client-provided delivery/order identity; verify assignment.
        const delivery = await Delivery.findOne({
          order: orderId,
          delivery_person: dp._id,
          delivery_status: "out_for_delivery",
        }).select("_id delivery_status");

        if (!delivery) return;

        const lastUpdatedAt = new Date();
        await Order.findByIdAndUpdate(orderId, {
          $set: {
            "deliveryTracking.driverId": dp._id,
            "deliveryTracking.latitude": Number(latitude),
            "deliveryTracking.longitude": Number(longitude),
            "deliveryTracking.lastUpdatedAt": lastUpdatedAt,
            "deliveryTracking.isOnline": true,
          },
        });

        const broadcastPayload = {
          orderId,
          driverId: dp._id,
          latitude: Number(latitude),
          longitude: Number(longitude),
          lastUpdatedAt,
        };

        io.to(`order:${orderId}`).emit("delivery:location:updated", broadcastPayload);

        // Temporary compatibility with your existing frontend event.
        io.to(`order:${orderId}`).emit("delivery:location_broadcast", {
          deliveryId: delivery._id,
          orderId,
          latitude: Number(latitude),
          longitude: Number(longitude),
          updatedAt: lastUpdatedAt.toISOString(),
        });
      } catch (e) {
        console.log("delivery:location:update failed:", e?.message || e);
      }
    };

    socket.on("delivery:location:update", (data) => {
      const { orderId, latitude, longitude } = data || {};
      handleDeliveryLocationUpdate({ orderId, latitude, longitude });
    });

    // Legacy event name used by your current hook/component.
    socket.on("delivery:location_update", (data) => {
      const { orderId, latitude, longitude } = data || {};
      handleDeliveryLocationUpdate({ orderId, latitude, longitude });
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected from Socket.IO: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
