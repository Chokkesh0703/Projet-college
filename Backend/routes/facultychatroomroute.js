import { Router } from 'express';
import Chats from '../models/Chat.js';
import authenticate from '../middleware/authenticate.js';
import mongoose from 'mongoose';

const Facultychatroomrouter = Router();

// Create a new chatroom
Facultychatroomrouter.post('/create', authenticate, async (req, res) => {
  const { studentId } = req.body;

  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID is required' });
  }

  try {
    // Check if chatroom already exists between the student and faculty
    let chatroom = await Chats.findOne({ student: studentId, faculty: req.user.id });
    if (chatroom) {
      return res.status(200).json({ success: true, chatroom, message: 'Chatroom already exists' });
    }

    // If not, create a new chatroom
    chatroom = new Chats({ student: studentId, faculty: req.user.id });
    await chatroom.save();
    res.status(201).json({ success: true, chatroom, message: 'Chatroom created successfully' });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Fetch all chatrooms for the logged-in faculty
Facultychatroomrouter.get('/all/:facultyId', async (req, res) => {
  const { facultyId } = req.params;  // Get studentId from request params

  if (!mongoose.Types.ObjectId.isValid(facultyId)) {
    return res.status(400).json({ success: false, message: 'Invalid faculty ID' });
  }

  try {
    // Fetch chatrooms where the student ID matches
    const chatrooms = await Chats.find({ faculty: facultyId })
      .populate('student', 'name email')  // Populate faculty details
      .sort({ updatedAt: -1 });  // Sort by latest updated chatrooms

    res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

Facultychatroomrouter.get('/student/:studentId', async (req, res) => {
  const { studentId } = req.params;  // Get studentId from request params

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ success: false, message: 'Invalid student ID' });
  }

  try {
    // Fetch chatrooms where the student ID matches
    const chatrooms = await Chats.find({ student: studentId })
      .populate('faculty', 'name email')  // Populate faculty details
      .sort({ updatedAt: -1 });  // Sort by latest updated chatrooms

    res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

// Send message in chatroom
Facultychatroomrouter.post('/send_message', authenticate, async (req, res) => {
  const { chatroomId, message, senderId, sendername } = req.body;

  if (!chatroomId || !message || !senderId) {
    return res.status(400).json({ success: false, message: 'Chatroom ID, message, and sender ID are required' });
  }

  try {
    const chatroom = await Chats.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ success: false, message: 'Chatroom not found' });
    }

    // Add the new message to the chatroom
    const newMessage = { sender: senderId, message, sendname: sendername, timestamp: new Date() };
    chatroom.messages.push(newMessage);

    // Update unread message count based on sender
    if (senderId.toString() === chatroom.faculty.toString()) {
      chatroom.studentUnreadCount += 1; // Increment unread messages for student
    } else {
      chatroom.facultyUnreadCount += 1; // Increment unread messages for faculty
    }

    await chatroom.save();

    // Emit the new message to all connected clients in the chatroom
    req.io.to(chatroomId).emit('receive_message', newMessage);

    res.status(201).json({ success: true, message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'Error sending message', details: error.message });
  }
});

// Mark messages as read
Facultychatroomrouter.post('/mark_as_read', authenticate, async (req, res) => {
  const { chatroomId } = req.body;

  if (!chatroomId) {
    return res.status(400).json({ success: false, message: 'Chatroom ID is required' });
  }

  try {
    const chatroom = await Chats.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ success: false, message: 'Chatroom not found' });
    }

    // Mark all messages as read and reset unread message count for the logged-in user
    if (req.user.id.toString() === chatroom.faculty.toString()) {
      chatroom.facultyUnreadCount = 0; // Reset unread messages for faculty
    } else {
      chatroom.studentUnreadCount = 0; // Reset unread messages for student
    }

    chatroom.messages.forEach((message) => {
      if (message.sender.toString() !== req.user.id.toString()) {
        message.isRead = true;
      }
    });

    await chatroom.save();
    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ success: false, message: 'Error marking messages as read', details: error.message });
  }
});

export default Facultychatroomrouter;
