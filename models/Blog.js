const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "published"],
    },
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resources: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

module.exports = Blog = mongoose.model("Blog", BlogSchema);
