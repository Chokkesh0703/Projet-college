import express from "express";
import Chatroom from "../models/Message.js";

const router = express.Router();

export default function setupChatroomRoutes(io) {
  // Fetch chatroom messages
  router.get("/:course/:yearofpass", async (req, res) => {
    try {
      const { course, yearofpass } = req.params;

      if (!course || !yearofpass) {
        return res.status(400).json({ error: "Missing course or yearofpass parameter" });
      }

      const chatroom = await Chatroom.findOne({ course, yearofpass })
        .populate("messages.sender", "name");

      if (!chatroom) {
        return res.status(404).json({ message: "No chatroom found for this course and year of passing" });
      }

      res.json(chatroom);
    } catch (error) {
      res.status(500).json({ error: "Error fetching chatroom", details: error.message });
    }
  });

  // Send message (with Socket.io)
  router.post("/:course/:yearofpass/message", async (req, res) => {
    try {
      const { sender, text } = req.body;
      const { course, yearofpass } = req.params;

      if (!sender || !text) {
        return res.status(400).json({ error: "Sender and text are required" });
      }

      let chatroom = await Chatroom.findOne({ course, yearofpass });

      // If chatroom doesn't exist, create & save it before adding messages
      if (!chatroom) {
        chatroom = new Chatroom({ course, yearofpass, messages: [], members: [sender] });
        await chatroom.save();
      }

      // Add sender to chatroom members if not already present
      if (!chatroom.members.includes(sender)) {
        chatroom.members.push(sender);
      }

      // Add new message
      const newMessage = { sender, text, timestamp: new Date() };
      chatroom.messages.push(newMessage);
      await chatroom.save();

      //  Emit the new message to all connected users in that chatroom
      io.to(`${course}-${yearofpass}`).emit("receiveMessage", newMessage);

      res.status(201).json({ message: "Message sent successfully", newMessage });
    } catch (error) {
      res.status(500).json({ error: "Error sending message", details: error.message });
    }
  });

  return router;
}
