import Chats from "../models/Chat.js";
import mongoose from "mongoose";

// Create or get chatroom
export const createChatroom = async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ success: false, message: "Student ID is required" });
  }

  try {
    let chatroom = await Chats.findOne({ student: studentId, faculty: req.user.id });
    if (chatroom) {
      return res.status(200).json({ success: true, chatroom, message: "Chatroom already exists" });
    }

    chatroom = new Chats({ student: studentId, faculty: req.user.id });
    await chatroom.save();
    res.status(201).json({ success: true, chatroom, message: "Chatroom created successfully" });
  } catch (error) {
    console.error("Error creating chatroom:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Fetch chatrooms by faculty
export const getFacultyChatrooms = async (req, res) => {
  const { facultyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(facultyId)) {
    return res.status(400).json({ success: false, message: "Invalid faculty ID" });
  }

  try {
    const chatrooms = await Chats.find({ faculty: facultyId })
      .populate("student", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Fetch chatrooms by student
export const getStudentChatrooms = async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ success: false, message: "Invalid student ID" });
  }

  try {
    const chatrooms = await Chats.find({ student: studentId })
      .populate("faculty", "name email")
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    console.error("Error fetching chatrooms:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Send message
export const sendMessage = (io) => async (req, res) => {
  const { chatroomId, message, senderId, sendername } = req.body;

  if (!chatroomId || !message || !senderId) {
    return res.status(400).json({ success: false, message: "Required fields missing" });
  }

  try {
    const chatroom = await Chats.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ success: false, message: "Chatroom not found" });
    }

    const newMessage = { sender: senderId, message, sendname: sendername, timestamp: new Date() };
    chatroom.messages.push(newMessage);

    if (senderId.toString() === chatroom.faculty.toString()) {
      chatroom.studentUnreadCount += 1;
    } else {
      chatroom.facultyUnreadCount += 1;
    }

    await chatroom.save();

    io.to(chatroomId).emit("receive_message", newMessage);

    res.status(201).json({ success: true, message: "Message sent", newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ success: false, message: "Error sending message", details: error.message });
  }
};

// Mark messages as read
export const markAsRead = async (req, res) => {
  const { chatroomId } = req.body;

  if (!chatroomId) {
    return res.status(400).json({ success: false, message: "Chatroom ID is required" });
  }

  try {
    const chatroom = await Chats.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ success: false, message: "Chatroom not found" });
    }

    if (req.user.id.toString() === chatroom.faculty.toString()) {
      chatroom.facultyUnreadCount = 0;
    } else {
      chatroom.studentUnreadCount = 0;
    }

    chatroom.messages.forEach((msg) => {
      if (msg.sender.toString() !== req.user.id.toString()) {
        msg.isRead = true;
      }
    });

    await chatroom.save();
    res.status(200).json({ success: true, message: "Messages marked as read" });
  } catch (error) {
    console.error("Error marking messages:", error);
    res.status(500).json({ success: false, message: "Error marking as read", details: error.message });
  }
};
