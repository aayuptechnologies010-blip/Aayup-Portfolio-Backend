const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    feedback: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    projectDelivered: { type: String, default: "" },
    avatar: { type: String, default: "" },
    approved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Testimonial", TestimonialSchema);
