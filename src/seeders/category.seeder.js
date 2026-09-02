const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const slugify = require("slugify");

dotenv.config({ path: path.join(__dirname, "../../.env") });
const Category = require("../models/category.model");

const categoriesData = [
  {
    name: "Hot Coffee & Espresso",
    description: "Freshly roasted specialty coffee and rich, handcrafted espresso drinks.",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Cold Beverages & Iced Teas",
    description: "Refreshing cold brews, iced lattes, fruit coolers, and artisanal iced teas.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Artisanal Bakery & Pastries",
    description: "Freshly baked butter croissants, fruit tarts, muffins, and artisan breads.",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Gourmet Sandwiches & Breakfast",
    description: "Savory sourdough toasts, gourmet panini, wraps, and wholesome breakfast bowls.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Handcrafted Pizza & Pasta",
    description: "Wood-fired artisanal pizzas, creamy pastas, and Italian small plates.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    name: "Signature Desserts",
    description: "Decadent cakes, creamy tiramisu, lava cakes, and sweet royal treats.",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
];

async function seedCategories() {
  try {
    const isStandalone = mongoose.connection.readyState === 0;
    if (isStandalone) {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/royal_cafe";
      await mongoose.connect(mongoUri);
      console.log("[Category Seeder] Connected to MongoDB.");
    }

    console.log("[Category Seeder] Clearing existing categories...");
    await Category.deleteMany({});

    const preparedCategories = categoriesData.map((cat) => ({
      ...cat,
      slug: slugify(cat.name, { lower: true, strict: true }),
    }));

    const createdCategories = await Category.insertMany(preparedCategories);
    console.log(`[Category Seeder] Successfully created ${createdCategories.length} categories.`);

    if (isStandalone) {
      await mongoose.disconnect();
      console.log("[Category Seeder] Disconnected from MongoDB.");
    }

    return createdCategories;
  } catch (error) {
    console.error("[Category Seeder] Error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  seedCategories();
}

module.exports = seedCategories;
