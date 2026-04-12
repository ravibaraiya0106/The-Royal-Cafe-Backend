const mongoose = require("mongoose");
const slugify = require("slugify");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    content: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

blogSchema.pre("save", async function () {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
});

/* ================= UPDATE SLUG ================= */

blogSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update?.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
    this.setUpdate(update);
  }
});

module.exports = mongoose.model("Blog", blogSchema);
