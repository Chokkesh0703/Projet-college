import express from "express";
import User from "../models/User.js";

const facultychatroomroute = express.Router();

facultychatroomroute.get("/faculty/students", async (req, res) => {
    try {
      const students = await User.find({ approve: false }); // Only unapproved students
      res.json(students);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

export default facultychatroomroute;