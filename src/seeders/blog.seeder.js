const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const slugify = require("slugify");

dotenv.config({ path: path.join(__dirname, "../../.env") });
const Blog = require("../models/blog.model");

const blogsData = [
  {
    title: "The Art of Roasting: From Bean to Your Royal Cup",
    content: `Coffee roasting is both a science and a delicate craft. At The Royal Cafe, every single batch of specialty Arabica coffee beans is roasted to perfection under controlled temperature profiles. 

In this post, we dive into how roast profiles—from light cinnamon roasts to dark French roasts—unlock unique origin flavors like jasmine, dark chocolate, citrus, and toasted hazelnut. Discover why fresh roasting makes all the difference in aroma and body!`,
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    title: "Why Cold Brew Coffee is the Ultimate Summer Refreshment",
    content: `Unlike traditional iced coffee brewed hot and poured over ice, true cold brew is steep-extracted over 18 hours using chilled filtered water. 

This slow immersion process creates a velvety smooth drink with up to 60% less acidity than hot-brewed coffee. Pair our 18-Hour Cold Brew with oat milk or a splash of vanilla syrup for the ultimate summer pick-me-up!`,
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    title: "Pairing Artisanal Pastries with your Morning Brew",
    content: `Pairing coffee with pastries is an age-old tradition that elevates your morning ritual. A rich, buttery French croissant complements the bright acidity of an Ethiopian single-origin espresso. 

Meanwhile, dark chocolate pastries harmonize delightfully with creamy cappuccinos and caffe lattes. Visit The Royal Cafe today and try our recommended daily coffee & pastry pairings!`,
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
  {
    title: "Ethical Sourcing & Our Passion for Sustainable Coffee Beans",
    content: `At The Royal Cafe, we believe great coffee should do good for the planet and the farming communities behind every harvest. 

We directly source 100% of our beans from certified fair-trade shade-grown farms across Chikmagalur and Coorg. Learn how your daily cup supports sustainable farming practices and local coffee growers.`,
    image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?q=80&w=800&auto=format&fit=crop",
    is_active: true,
  },
];

async function seedBlogs() {
  try {
    const isStandalone = mongoose.connection.readyState === 0;
    if (isStandalone) {
      const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/royal_cafe";
      await mongoose.connect(mongoUri);
      console.log("[Blog Seeder] Connected to MongoDB.");
    }

    console.log("[Blog Seeder] Clearing existing blogs...");
    await Blog.deleteMany({});

    const preparedBlogs = blogsData.map((blog) => ({
      ...blog,
      slug: slugify(blog.title, { lower: true, strict: true }),
    }));

    const createdBlogs = await Blog.insertMany(preparedBlogs);
    console.log(`[Blog Seeder] Successfully created ${createdBlogs.length} blog posts.`);

    if (isStandalone) {
      await mongoose.disconnect();
      console.log("[Blog Seeder] Disconnected from MongoDB.");
    }

    return createdBlogs;
  } catch (error) {
    console.error("[Blog Seeder] Error:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

if (require.main === module) {
  seedBlogs();
}

module.exports = seedBlogs;
