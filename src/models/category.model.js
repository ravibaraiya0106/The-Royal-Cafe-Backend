const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
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
  {
    timestamps: true,
  },
);
categorySchema.index(
  { name: 1 },
  {
    unique: true,
    partialFilterExpression: { is_active: true },
  },
);

categorySchema.index(
  { slug: 1 },
  {
    unique: true,
    partialFilterExpression: { is_active: true },
  },
);
/* Auto generate slug before save */
categorySchema.pre("save", async function () {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
});

/* Update slug when name changes */
categorySchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  if (update?.name) {
    update.slug = slugify(update.name, { lower: true, strict: true });
    this.setUpdate(update);
  }
});

module.exports = mongoose.model("Category", categorySchema);
