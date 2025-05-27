import Chatroom from "../models/Message.js";
import mongoose from "mongoose";

// Fetch all messages in a chatroom
export const getChatroomMessages = async (req, res) => {
  try {
    const { course, yearofpass } = req.params;

    if (!course || !yearofpass) {
      return res.status(400).json({ error: "Missing course or yearofpass parameter" });
    }

    const chatroom = await Chatroom.findOne({ course, yearofpass })
      .populate("messages.sender", "name"); // Populates each sender inside messages[]

    if (!chatroom) {
      return res.status(404).json({ message: "No chatroom found for this course and year of passing" });
    }

    res.json({ messages: chatroom.messages }); // Return just the messages array
  } catch (error) {
    res.status(500).json({ error: "Error fetching chatroom", details: error.message });
  }
};

// Post a new message to a chatroom and emit via socket.io
export const postChatMessage = (io) => async (req, res) => {
  try {
    const { sender, text } = req.body;
    const { course, yearofpass } = req.params;

    if (!sender || !text) {
      return res.status(400).json({ error: "Sender and text are required" });
    }

    // Find or create the chatroom
    let chatroom = await Chatroom.findOne({ course, yearofpass });

    if (!chatroom) {
      chatroom = new Chatroom({ course, yearofpass, messages: [], members: [sender] });
    }

    // Add sender to members if not already
    if (!chatroom.members.includes(sender)) {
      chatroom.members.push(sender);
    }

    // Create the new message
    const newMessage = {
      sender: new mongoose.Types.ObjectId(sender),
      text,
      timestamp: new Date(),
    };

    // Push the message and save the chatroom
    chatroom.messages.push(newMessage);
    await chatroom.save();

    // Populate the sender of the last message added
    await chatroom.populate("messages.sender", "name");

    // Get the last message with populated sender
    const populatedMessage = chatroom.messages[chatroom.messages.length - 1];

    // Emit to all clients in the chatroom
    io.to(`${course}-${yearofpass}`).emit("receiveMessage", populatedMessage);

    res.status(201).json({ message: "Message sent successfully", newMessage: populatedMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Error sending message", details: error.message });
  }
};
