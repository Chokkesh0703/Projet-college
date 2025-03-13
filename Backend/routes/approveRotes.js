import express from "express";
import User from "../models/User.js";

const approverouter = express.Router();

// Fetch only unapproved students
approverouter.get("/admin/students", async (req, res) => {
  try {
    const students = await User.find({ approve: false }); // Only unapproved students
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

//Faculty details 
approverouter.get("/admin/faculties", async (req, res) => {
  try {
      const students = await User.find({ approve: true, role: "faculty" }); // Only approved students
      console.log(students);
      res.json(students);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
  }
});

approverouter.get("/admin/students", async (req, res) => {
  try {
      const students = await User.find({ approve: true, role: "student" }); // Only approved students
      console.log(students);
      res.json(students);
  } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
  }
});

// Approve Student
approverouter.put("/admin/approve/:id", async (req, res) => {
  try {
    const student = await User.findByIdAndUpdate(
      req.params.id,
      { approve: true },
      { new: true }
    );

    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Failed to approve student" });
  }
});

// Reject Student (Delete from DB)
approverouter.delete("/admin/reject/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Student rejected and removed from database" });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject student" });
  }
});

export default approverouter;
