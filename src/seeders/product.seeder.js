const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const slugify = require("slugify");

dotenv.config({ path: path.join(__dirname, "../../.env") });
const Product = require("../models/product.model");
const Category = require("../models/category.model");

const productsData = [
  /* Hot Coffee & Espresso */
  {
    categoryName: "Hot Coffee & Espresso",
    name: "Royal Velvet Cappuccino",
    description: "Rich espresso topped with a smooth layer of velvety steamed milk foam and cocoa dusting.",
    price: 190,
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Hot Coffee & Espresso",
    name: "Double Shot Espresso",
    description: "Intense, full-bodied double shot extracted from premium single-origin Arabica beans.",
    price: 140,
    image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },
  {
    categoryName: "Hot Coffee & Espresso",
    name: "Salted Caramel Latte",
    description: "Signature espresso blended with steamed milk and rich house-made salted caramel syrup.",
    price: 220,
    image: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Hot Coffee & Espresso",
    name: "Classic Caffe Latte",
    description: "Smooth espresso gently balanced with hot silky steamed milk.",
    price: 180,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },

  /* Cold Beverages & Iced Teas */
  {
    categoryName: "Cold Beverages & Iced Teas",
    name: "Signature 18-Hour Cold Brew",
    description: "Slow-steeped for 18 hours for a naturally sweet, low-acid, ultrasmooth coffee flavor.",
    price: 210,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Cold Beverages & Iced Teas",
    name: "Iced Japanese Matcha Latte",
    description: "Ceremonial grade Uji green tea matcha whisked with cold milk over ice.",
    price: 240,
    image: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Cold Beverages & Iced Teas",
    name: "Peach & Passionfruit Iced Tea",
    description: "Freshly brewed black tea infused with sweet peach nectar and tangy passionfruit juice.",
    price: 170,
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },

  /* Artisanal Bakery & Pastries */
  {
    categoryName: "Artisanal Bakery & Pastries",
    name: "French Butter Croissant",
    description: "Flaky, golden-brown puff pastry baked fresh every morning with pure French butter.",
    price: 130,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Artisanal Bakery & Pastries",
    name: "Pain au Chocolat",
    description: "Crisp butter croissant dough filled with two sticks of dark Belgian chocolate.",
    price: 160,
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },
  {
    categoryName: "Artisanal Bakery & Pastries",
    name: "Wild Blueberry Cream Muffin",
    description: "Moist vanilla muffin bursting with fresh wild blueberries and a light sugar crumble top.",
    price: 150,
    image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },

  /* Gourmet Sandwiches & Breakfast */
  {
    categoryName: "Gourmet Sandwiches & Breakfast",
    name: "Avocado & Poached Egg Toast",
    description: "Smashing ripe avocado on toasted artisan sourdough topped with organic poached egg and chili flakes.",
    price: 280,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Gourmet Sandwiches & Breakfast",
    name: "Grilled Chicken Pesto Panini",
    description: "Herb-marinated chicken breast, basil pesto, mozzarella, and sun-dried tomatoes pressed hot.",
    price: 320,
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Gourmet Sandwiches & Breakfast",
    name: "Triple Stack Berry Pancakes",
    description: "Fluffy buttermilk pancakes stacked high with fresh berries, whipped butter, and maple syrup.",
    price: 260,
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },

  /* Handcrafted Pizza & Pasta */
  {
    categoryName: "Handcrafted Pizza & Pasta",
    name: "Artisan Margherita Pizza",
    description: "Wood-fired thin crust topped with San Marzano tomato sauce, fresh mozzarella, and aromatic basil.",
    price: 350,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Handcrafted Pizza & Pasta",
    name: "Truffle Cream Fettuccine Alfredo",
    description: "Fresh fettuccine pasta tossed in rich parmesan truffle cream sauce with sautéed mushrooms.",
    price: 390,
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },

  /* Signature Desserts */
  {
    categoryName: "Signature Desserts",
    name: "Authentic Tiramisu Classico",
    description: "Traditional Italian dessert made with espresso-soaked ladyfingers and whipped mascarpone cream.",
    price: 260,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Signature Desserts",
    name: "Belgian Chocolate Lava Cake",
    description: "Warm chocolate cake with a molten dark chocolate center, served with vanilla bean ice cream.",
    price: 240,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop",
    is_special: true,
    is_active: true,
  },
  {
    categoryName: "Signature Desserts",
    name: "New York Vanilla Cheesecake",
    description: "Dense, creamy classic NY cheesecake on a graham cracker crust topped with strawberry compote.",
    price: 270,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop",
    is_special: false,
    is_active: true,
  },
];

async function seedProducts() {
  try {
    const isStandalone = mongoose.connection.readyState === 0;
    if (isStandalone) {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/royal_cafe";
      await mongoose.connect(mongoUri);
      console.log("[Product Seeder] Connected to MongoDB.");
    }

    const categories = await Category.find({});
    if (categories.length === 0) {
      throw new Error("No categories found in database. Please run Category Seeder first!");
    }

    const categoryMap = {};
    categories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });

    console.log("[Product Seeder] Clearing existing products...");
    await Product.deleteMany({});

    const preparedProducts = productsData.map((prod) => {
      const catId = categoryMap[prod.categoryName];
      if (!catId) {
        console.warn(`[Product Seeder] Category missing for '${prod.categoryName}', skipping...`);
      }
      return {
        name: prod.name,
        slug: slugify(prod.name, { lower: true, strict: true }),
        category: catId || categories[0]._id,
        description: prod.description,
        price: prod.price,
        image: prod.image,
        is_special: prod.is_special,
        is_active: prod.is_active,
      };
    });

    const createdProducts = await Product.insertMany(preparedProducts);
    console.log(`[Product Seeder] Successfully created ${createdProducts.length} menu products.`);

    if (isStandalone) {
      await mongoose.disconnect();
      console.log("[Product Seeder] Disconnected from MongoDB.");
    }

    return createdProducts;
  } catch (error) {
    console.error("[Product Seeder] Error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
