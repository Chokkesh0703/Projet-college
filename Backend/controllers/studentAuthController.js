import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const studentLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Login Request Received:", { email, password });

  try {
    const student = await User.findOne({ email });

    if (!student) {
      console.log("Student Not Found");
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.Password) {
      console.log("Password Missing in DB");
      return res
        .status(500)
        .json({ message: "Server error: Password missing in DB" });
    }

    if (student.approve !== true) {
      console.log("Not Approved");
      return res.status(403).json({ message: "Student not approved" });
    }

    if (student.role !== "student") {
      return res.status(403).json({ message: "Invalid role" });
    }

    const isMatch = await bcrypt.compare(password, student.Password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      console.log("Invalid Credentials");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET is missing in environment variables!");
      return res
        .status(500)
        .json({ message: "Server error: Missing JWT secret" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "300d",
    });

    console.log("JWT Token Generated");

    res.json({
      status: "success",
      token,
      ID: student._id,
      name: student.name,
      role: student.role,
      email: student.email,
      course: student.course,
      yearofpass: student.yearofpass,
    });
  } catch (error) {
    console.error("Student login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
