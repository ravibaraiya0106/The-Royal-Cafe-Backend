const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedCategories = require("./category.seeder");
const seedProducts = require("./product.seeder");
const seedBlogs = require("./blog.seeder");
const seedCoupons = require("./coupon.seeder");

async function runAllSeeders() {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/royal_cafe";
    console.log(`[Master Seeder] Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("[Master Seeder] Connected to MongoDB successfully.\n");

    console.log("=== STARTING ALL SEEDERS ===");
    await seedCategories();
    await seedProducts();
    await seedBlogs();
    await seedCoupons();
    console.log("=== ALL SEEDERS COMPLETED SUCCESSFULLY ===\n");

    await mongoose.disconnect();
    console.log("[Master Seeder] Disconnected from MongoDB cleanly.");
    process.exit(0);
  } catch (error) {
    console.error("[Master Seeder] Fatal Error during seeding:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

runAllSeeders();
