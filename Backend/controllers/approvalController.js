// controllers/approvalController.js
import User from "../models/User.js";

// Fetch only unapproved students
export const getUnapprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ approve: false });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch unapproved students" });
  }
};

// Fetch approved faculties
export const getApprovedFaculties = async (req, res) => {
  try {
    const faculties = await User.find({ approve: true, role: "faculty" });
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch faculties" });
  }
};

// Fetch approved students
export const getApprovedStudents = async (req, res) => {
  try {
    const students = await User.find({ approve: true, role: "student" });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Approve a student or faculty
export const approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { approve: true },
      { new: true }
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve user" });
  }
};

// Reject (delete) a student or faculty
export const rejectUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User rejected and removed from database" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject user" });
  }
};
