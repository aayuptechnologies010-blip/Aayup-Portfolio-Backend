const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    icon: { type: String, default: "Globe" },
    description: { type: String, required: true },
    highlight: { type: String, default: "" },
    deliverables: [{ type: String }],
    techTags: [{ type: String }],
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
