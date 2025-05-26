// controllers/adminController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Request Received:", { email, password });

  try {
    const admin = await User.findOne({ email: email.trim() });
    if (!admin) {
      console.log("Admin Not Found");
      return res.status(404).json({ message: "Admin not found" });
    }

    if (!admin.Password) {
      console.log("Password missing in DB");
      return res.status(500).json({ message: "Server error: Password missing in DB" });
    }

    if (admin.role !== "admin") {
      console.log("Not an admin");
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    if (admin.approve !== true) {
      console.log("Admin not approved");
      return res.status(403).json({ message: "Admin not approved" });
    }

    const isMatch = await bcrypt.compare(password, admin.Password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET missing");
      return res.status(500).json({ message: "Server error: Missing JWT secret" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "300d",
    });

    console.log("JWT Token Generated");

    res.json({
      message: "Login successful",
      token,
      ID: admin._id,
      name: admin.name,
      role: admin.role,
      email: admin.email,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
