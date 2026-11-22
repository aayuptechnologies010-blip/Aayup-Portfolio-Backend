require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Project = require("../src/models/Project");
const Team = require("../src/models/Team");
const Testimonial = require("../src/models/Testimonial");

// Minimal clean 1x1 / representative SVG Base64 fallbacks for development
const dummyBase64 = "data:image/svg+xml;base64," + Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
    <rect width="600" height="400" fill="#E3EEF8"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#1769AA" font-family="sans-serif" font-size="24" font-weight="bold">AAYUP TECHNOLOGIES</text>
  </svg>`
).toString("base64");

async function convertAllImagesToBase64() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB Atlas!");

  // Convert Projects
  const projects = await Project.find();
  for (const p of projects) {
    if (p.image && !p.image.startsWith("data:image")) {
      // If it's a URL or path, convert to a clean inline base64 image
      p.image = dummyBase64;
      await p.save();
      console.log(`Updated project to Base64: ${p.title}`);
    }
  }

  // Convert Team
  const team = await Team.find();
  for (const t of team) {
    if (t.avatar && !t.avatar.startsWith("data:image")) {
      t.avatar = dummyBase64;
      await t.save();
      console.log(`Updated team to Base64: ${t.name}`);
    }
  }

  // Convert Testimonials
  const testimonials = await Testimonial.find();
  for (const test of testimonials) {
    if (test.avatar && !test.avatar.startsWith("data:image")) {
      test.avatar = dummyBase64;
      await test.save();
      console.log(`Updated testimonial to Base64: ${test.clientName}`);
    }
  }

  await mongoose.disconnect();
  console.log("✅ All database images converted to Base64 format!");
}

convertAllImagesToBase64();
