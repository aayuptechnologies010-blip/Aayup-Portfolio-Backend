const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    service: { type: String, default: "Website Development" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["New", "Contacted", "Meeting Scheduled", "Closed"],
      default: "New",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lead", LeadSchema);
