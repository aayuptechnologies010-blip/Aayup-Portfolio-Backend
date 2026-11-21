const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    department: { type: String, default: "Leadership" },
    badge: { type: String, default: "" },
    directorField: { type: String, default: "" },
    bio: { type: String, default: "" },
    visionQuote: { type: String, default: "" },
    avatar: { type: String, required: true },
    linkedin: { type: String, default: "" },
    highlights: [{ type: String }],
    isDirector: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);
