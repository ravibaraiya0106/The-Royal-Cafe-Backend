const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      default: "",
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    is_special: {
      type: Boolean,
      default: false,
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* ================= AUTO GENERATE SLUG ================= */

productSchema.pre("save", async function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

/* ================= UPDATE SLUG ================= */

productSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update?.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
    this.setUpdate(update);
  }
});

module.exports = mongoose.model("Product", productSchema);
