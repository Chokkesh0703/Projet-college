import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Faculty Login Controller
export const facultyLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log("Faculty Login Request:", { email, password });

  try {
    const faculty = await User.findOne({ email: email.trim() });

    if (!faculty) {
      console.log("Faculty Not Found");
      return res.status(404).json({ message: "Faculty not found" });
    }

    if (!faculty.Password) {
      console.log("Password field missing in DB");
      return res.status(500).json({ message: "Password missing in DB" });
    }

    if (faculty.role !== "faculty") {
      console.log("User is not a faculty");
      return res.status(403).json({ message: "Not a faculty user" });
    }

    if (faculty.approve !== true) {
      console.log("Faculty not approved");
      return res.status(403).json({ message: "Faculty not approved yet" });
    }

    const isMatch = await bcrypt.compare(password, faculty.Password);
    console.log("Password Match Result:", isMatch);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing");
      return res.status(500).json({ message: "Missing JWT secret" });
    }

    const token = jwt.sign({ id: faculty._id }, process.env.JWT_SECRET, {
      expiresIn: "300d",
    });

    console.log("Faculty JWT Token Generated");

    res.json({
      message: "Login successful",
      token,
      ID: faculty._id,
      name: faculty.name,
      role: faculty.role,
      email: faculty.email,
    });
  } catch (error) {
    console.error("Faculty Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
