const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, default: "" },
    category: {
      type: String,
      enum: ["Web Platforms", "Mobile Apps", "CRM / ERP", "AI & Automation"],
      required: true,
    },
    image: { type: String, required: true },
    description: { type: String, required: true },
    problem: { type: String, default: "" },
    solution: { type: String, default: "" },
    keyFeatures: [{ type: String }],
    techStack: [{ type: String }],
    metrics: { type: String, default: "" },
    duration: { type: String, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
