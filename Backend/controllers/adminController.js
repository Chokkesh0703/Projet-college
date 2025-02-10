const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// exports.registerAdmin = async (req, res) => {
//   const { adminId, password } = req.body;

//   try {
//     const existingAdmin = await Admin.findOne({ adminId });
//     if (existingAdmin) return res.status(400).json({ message: "Admin already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newAdmin = new Admin({ adminId, password: hashedPassword });

//     await newAdmin.save();
//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// exports.loginAdmin = async (req, res) => {
//   const { adminId, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ adminId });
//     if (!admin) return res.status(400).json({ message: "Admin not found" });

//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ adminId: admin.adminId }, process.env.JWT_SECRET, { expiresIn: "1h" });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
