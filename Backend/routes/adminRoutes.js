// Admin Login Route (adminRoutes.js)
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { adminId, password } = req.body;
  console.log(" Login Request Received:", { adminId, password });

  try {
    // 🔹 Check if admin exists
    const admin = await Admin.findOne({ adminId });
    if (!admin) {
      console.log(" Admin Not Found");
      return res.status(404).json({ message: "Admin not found" });
    }

    // 🔹 Ensure password exists in DB
    if (!admin.password) {
      console.log(" Password Missing in DB");
      return res
        .status(500)
        .json({ message: "Server error: Password missing in DB" });
    }

    //  Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log(" Invalid Credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 🔹 Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      console.log(" JWT_SECRET is missing in environment variables!");
      return res
        .status(500)
        .json({ message: "Server error: Missing JWT secret" });
    }

    //  Generate JWT Token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "300d",
    });


    console.log(" JWT Token Generated");

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error(" Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
