const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    // slug: {
    //   type: String,
    //   unique: true,
    //   lowercase: true,
    //   trim: true,
    //   index: true,
    // },

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

// /* Auto generate slug before save */
// categorySchema.pre("save", function (next) {
//   try {
//     if (this.name) {
//       this.slug = slugify(this.name, { lower: true, strict: true });
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /* Update slug when name changes */
// categorySchema.pre("findOneAndUpdate", function (next) {
//   try {
//     const update = this.getUpdate();

//     if (update && update.name) {
//       update.slug = slugify(update.name, { lower: true, strict: true });
//       this.setUpdate(update);
//     }

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

module.exports = mongoose.model("Category", categorySchema);
