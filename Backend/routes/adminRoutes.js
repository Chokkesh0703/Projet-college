// Admin Login Route (adminRoutes.js)
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

const router = express.Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(" Login Request Received:", { email, password });

  try {
    // 🔹 Check if admin exists
    const admin = await User.findOne({ email: email.trim() }); // Trim whitespace
    if (!admin) {
      console.log(" Admin Not Found");
      return res.status(404).json({ message: "Admin not found" });
    }
    if (!admin.Password) {
      console.log(" Password field is missing in DB for this user.");
      return res.status(500).json({ message: "Server error: Password missing in DB" });
    }
        
    if(admin.role != "admin"){
      console.log("Not an admin")
      return res
        .status(500)
        .json({ message: "Server error: Admin missing in DB" });
    }

    if(admin.approve != true){
      console.log("Not Approved")
      return res
        .status(500)
        .json({ message: "Admin not approved" });
    }

    //  Verify password
    const isMatch = await bcrypt.compare(password, admin.Password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log(" Invalid Credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    //  Ensure JWT secret exists
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

    res.json({
      message: "Login successful",
      token,      //  JWT Token for authentication
      ID: admin._id, //  Admin User ID
      name: admin.name, //  Admin's Name
      role: admin.role, //  Admin Role
      email: admin.email //  Admin Email
    });
  } catch (error) {
    console.error(" Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
