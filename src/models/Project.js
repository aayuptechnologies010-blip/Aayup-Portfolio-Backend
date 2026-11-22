const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Project Name
    category: {
      type: String,
      enum: ["Web Platforms", "Mobile Apps", "CRM / ERP", "AI & Automation", "Our Products"],
      required: true,
    }, // Categories
    liveLink: { type: String, default: "" }, // Live Link
    image: { type: String, required: true }, // Thumbnail (Base64)
    isProduct: { type: Boolean, default: false }, // Optional toggle: Is this one of Our Products?
    description: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
