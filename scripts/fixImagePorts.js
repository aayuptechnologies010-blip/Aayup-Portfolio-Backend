require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Project = require("../src/models/Project");

async function fix() {
  await mongoose.connect(process.env.MONGODB_URI);
  const projects = await Project.find();
  for (const p of projects) {
    if (p.image && p.image.includes("localhost:5000")) {
      p.image = p.image.replace("localhost:5000", "localhost:8000");
      await p.save();
      console.log(`Updated project image for ${p.title} -> ${p.image}`);
    }
  }
  await mongoose.disconnect();
  console.log("Port fix done!");
}

fix();
