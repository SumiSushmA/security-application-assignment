// server.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import app from "./app.js";
import connectDB from "./database/database.js";
import User from "./models/user.model.js"; // ← Import your User model

// Pull your admin creds from .env
const { ADMIN_EMAIL, ADMIN_PASSWORD, PORT = 8000 } = process.env;

// 1️⃣ Seed helper
async function seedAdmin() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.warn("Skipping admin seed: ADMIN_EMAIL or ADMIN_PASSWORD not set");
    return;
  }
  const exists = await User.findOne({ email: ADMIN_EMAIL });
  if (exists) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
    return;
  }
  await User.create({
    fullname: "Administrator",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });
  console.log(`✅ Seeded admin user: ${ADMIN_EMAIL}`);
}

// 2️⃣ Connect and start
connectDB()
  .then(async () => {
    // run the seeder before listening
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}...`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed!!!", err);
  });
