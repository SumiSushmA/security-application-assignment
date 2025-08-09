const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose
  .connect("mongodb://127.0.0.1:27017/PlaceMate_security")
  .then(async () => {
    const hashed = await bcrypt.hash("NewStrongPass123", 10);
    await User.updateOne(
      { email: "sushmasharma20040908@gmail.com" },
      { $set: { password: hashed, role: "admin", isEmailVerified: true } }
    );
    console.log("Admin password reset and role ensured");
    process.exit(0);
  })
  .catch((e) => {
    console.error("Connection error:", e);
    process.exit(1);
  });
