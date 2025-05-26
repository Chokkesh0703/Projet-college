import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { name, course, collegeid, unid, yearofpass, email, phoneno, Password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json("exist");

    if (!["admin", "student", "faculty"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);

    const newUser = new User({
      name, course, collegeid, unid, yearofpass, email, phoneno,
      Password: hashedPassword, approve: false, role,
    });

    await newUser.save();
    res.json("notexist");
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json("server error");
  }
};
