import express from "express";
import Chatroom from "../models/Message.js";

const router = express.Router();

// Fetch or create chatroom messages
router.get("/:course/:yearofpass", async (req, res) => {
    try {
      const { course, yearofpass } = req.params;
  
      if (!course || !yearofpass) {
        return res.status(400).json({ error: "Missing course or yearofpass parameter" });
      }
  
      const chatroom = await Chatroom.findOne({ course, yearofpass }).populate("messages.sender", "name");
  
      if (!chatroom) {
        return res.status(404).json({ message: "No chatroom found for this course and year of passing" });
      }
  
      res.json(chatroom);
    } catch (error) {
      res.status(500).json({ error: "Error fetching chatroom", details: error.message });
    }
  });
  

// Send message (Non-Socket.io route)
router.post("/:course/:yearofpass/message", async (req, res) => {
    try {
      const { sender, text } = req.body;
      const { course, yearofpass } = req.params;

      console.log("Received Params:", { course, yearofpass }); // ✅ Debugging
      console.log("Received Body:", { sender, text });
  
      if (!sender || !text) {
        return res.status(400).json({ error: "Sender and text are required" });
      }
  
      let chatroom = await Chatroom.findOne({ course, yearofpass });
  
      // If chatroom doesn't exist, create & save it before adding messages
      if (!chatroom) {
        chatroom = new Chatroom({ course, yearofpass, messages: [] });
        await chatroom.save();
      }
  
      // Add new message
      const newMessage = { sender, text, timestamp: new Date() };
      chatroom.messages.push(newMessage);
      await chatroom.save(); 
  
      // Return only the new message
      res.status(201).json({ message: "Message sent successfully", newMessage });
  
    } catch (error) {
      res.status(500).json({ error: "Error sending message", details: error.message });
    }
  });
  

export { router as chatroomRouter };
