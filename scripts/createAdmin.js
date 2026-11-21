require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const readline = require("readline");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../src/models/User");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function createAdmin() {
  console.log("\n==========================================");
  console.log("       Aayup Technologies Admin Setup     ");
  console.log("==========================================\n");

  const mongoUri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/aayup_portfolio";

  try {
    console.log(`[Database] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("[Database] Connected successfully!\n");

    const name = await ask("Enter Admin Full Name (e.g. Aayush Pandey): ");
    if (!name.trim()) {
      console.log("❌ Error: Admin name cannot be empty.");
      process.exit(1);
    }

    const email = await ask("Enter Admin Email (e.g. admin@aayuptechnologies.com): ");
    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      console.log("❌ Error: Invalid email address format.");
      process.exit(1);
    }

    // Check if user already exists
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      console.log(`⚠️ User with email '${cleanEmail}' already exists!`);
      const updateChoice = await ask("Do you want to reset their password? (y/n): ");
      if (updateChoice.trim().toLowerCase() !== "y") {
        console.log("Aborted.");
        process.exit(0);
      }
    }

    const password = await ask("Enter Admin Password (min 6 characters): ");
    if (!password || password.length < 6) {
      console.log("❌ Error: Password must be at least 6 characters long.");
      process.exit(1);
    }

    const roleInput = await ask("Enter Role (admin/editor) [default: admin]: ");
    const role = roleInput.trim().toLowerCase() === "editor" ? "editor" : "admin";

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (existing) {
      existing.name = name.trim();
      existing.password = hashedPassword;
      existing.role = role;
      await existing.save();
      console.log("\n==========================================");
      console.log("✅ Admin user credentials updated successfully!");
    } else {
      await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role,
      });
      console.log("\n==========================================");
      console.log("✅ New Admin user created successfully!");
    }

    console.log(`👤 Name:     ${name.trim()}`);
    console.log(`📧 Email:    ${cleanEmail}`);
    console.log(`🔑 Role:     ${role}`);
    console.log("==========================================\n");
  } catch (err) {
    console.error("❌ An error occurred:", err.message);
  } finally {
    rl.close();
    await mongoose.disconnect();
    process.exit(0);
  }
}

createAdmin();
