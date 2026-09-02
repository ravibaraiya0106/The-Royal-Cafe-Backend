const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });
const Coupon = require("../models/coupon.model");

const couponsData = [
  {
    code: "ROYAL10",
    description: "Get 10% OFF on your coffee & breakfast orders!",
    discount_type: "percentage",
    discount_value: 10,
    min_order_amount: 200,
    max_discount: 50,
    expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    usage_limit: 500,
    is_active: true,
  },
  {
    code: "WELCOME50",
    description: "Flat ₹50 OFF on your first order above ₹300!",
    discount_type: "flat",
    discount_value: 50,
    min_order_amount: 300,
    max_discount: 50,
    expiry_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    usage_limit: 1000,
    is_active: true,
  },
  {
    code: "FLAT100",
    description: "Flat ₹100 OFF on orders above ₹600!",
    discount_type: "flat",
    discount_value: 100,
    min_order_amount: 600,
    max_discount: 100,
    expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usage_limit: 300,
    is_active: true,
  },
];

async function seedCoupons() {
  try {
    const isStandalone = mongoose.connection.readyState === 0;
    if (isStandalone) {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/royal_cafe";
      await mongoose.connect(mongoUri);
      console.log("[Coupon Seeder] Connected to MongoDB.");
    }

    console.log("[Coupon Seeder] Clearing existing coupons...");
    await Coupon.deleteMany({});

    const createdCoupons = await Coupon.insertMany(couponsData);
    console.log(`[Coupon Seeder] Successfully created ${createdCoupons.length} discount coupons.`);

    if (isStandalone) {
      await mongoose.disconnect();
      console.log("[Coupon Seeder] Disconnected from MongoDB.");
    }

    return createdCoupons;
  } catch (error) {
    console.error("[Coupon Seeder] Error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  seedCoupons();
}

module.exports = seedCoupons;
