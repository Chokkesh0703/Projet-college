// student Login Route (studentRoutes.js)
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const StudentLoginrouter = express.Router();

StudentLoginrouter.post("/login", async (req, res) => {
  const { email, studentPassword } = req.body;
  console.log(" Login Request Received:", { email, studentPassword });

  try {

    const student = await User.findOne({ email });
    if (!student) {
      console.log(" Student Not Found");
      return res.status(404).json({ message: "Student not found" });
    }

    //  Ensure password exists in DB
    if (!student.studentPassword) {
      console.log(" Password Missing in DB");
      return res
        .status(500)
        .json({ message: "Server error: Password missing in DB" });
    }

    //  Verify password
    const isMatch = await bcrypt.compare(studentPassword, student.studentPassword);
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
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    console.log(" JWT Token Generated");

    res.json({ status: "success", token: token });
  } catch (error) {
    console.error(" Admin login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default StudentLoginrouter;