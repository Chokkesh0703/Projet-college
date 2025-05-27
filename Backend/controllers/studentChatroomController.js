import Chats from '../models/Chat.js';
import mongoose from 'mongoose';

// Create a new chatroom (only one per student-faculty pair)
export const createChatroom = async (req, res) => {
  const { studentId } = req.body;

  // Validate input
  if (!studentId) {
    return res.status(400).json({ success: false, message: 'Student ID is required' });
  }

  try {
    console.log(req.user.id, req.user.role, studentId);
    // Check if chatroom already exists between these two users
    const existingChatroom = await Chats.findOne({
      $or: [
        { student: req.user.id, faculty: studentId },
        { student: studentId, faculty: req.user.id },
      ],
    });

    if (existingChatroom) {
      return res.status(200).json({
        success: true,
        chatroom: existingChatroom,
        message: 'Chatroom already exists',
      });
    }

    // Determine who is student and who is faculty
    let student, faculty;

    if (req.user.role === 'faculty') {
      faculty = req.user.id;
      student = studentId;
    } else if (req.user.role === 'student') {
      student = req.user.id;
      faculty = studentId;
    } else {
      return res.status(403).json({ success: false, message: 'Invalid user role' });
    }

    // Create and save new chatroom
    const newChatroom = new Chats({ student, faculty });
    await newChatroom.save();

    return res.status(201).json({
      success: true,
      chatroom: newChatroom,
      message: 'Chatroom created successfully',
    });
  } catch (error) {
    console.error('Error creating chatroom:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};


// Get all chatrooms for a faculty
export const getAllChatroomsForFaculty = async (req, res) => {
  const { facultyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(facultyId)) {
    return res.status(400).json({ success: false, message: 'Invalid faculty ID' });
  }

  try {
    const chatrooms = await Chats.find({ faculty: facultyId })
      .populate('student', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Get all chatrooms for a student
export const getAllChatroomsForStudent = async (req, res) => {
  const { studentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    return res.status(400).json({ success: false, message: 'Invalid student ID' });
  }

  try {
    const chatrooms = await Chats.find({ student: studentId })
      .populate('faculty', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ success: true, chatrooms });
  } catch (error) {
    console.error('Error fetching chatrooms:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Send a message in chatroom
export const sendMessage = async (req, res) => {
  const { chatroomId, message, sender, sendername } = req.body;

  if (!chatroomId || !message || !sender) {
    return res.status(400).json({ success: false, message: 'Chatroom ID, message, and sender ID are required' });
  }

  try {
    const chatroom = await Chats.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ success: false, message: 'Chatroom not found' });
    }

    const newMessage = {
      sender,
      message,
      sendname: sendername,
      timestamp: new Date(),
      isRead: false,
    };

    chatroom.messages.push(newMessage);

    if (sender.toString() === chatroom.faculty.toString()) {
      chatroom.studentUnreadCount += 1;
    } else {
      chatroom.facultyUnreadCount += 1;
    }

    await chatroom.save();

    req.io.to(chatroomId).emit('receive_message', newMessage);

    res.status(201).json({ success: true, message: 'Message sent successfully', newMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'Error sending message', details: error.message });
  }
};

// Mark all messages as read
export const markMessagesAsRead = async (req, res) => {
  const { chatroomId } = req.body;

  if (!chatroomId) {
    return res.status(400).json({ success: false, message: 'Chatroom ID is required' });
  }

  try {
    const chatroom = await Chats.findById(chatroomId);
    if (!chatroom) {
      return res.status(404).json({ success: false, message: 'Chatroom not found' });
    }

    if (req.user.id.toString() === chatroom.faculty.toString()) {
      chatroom.facultyUnreadCount = 0;
    } else {
      chatroom.studentUnreadCount = 0;
    }

    // Mark messages sent by the opposite party as read
    chatroom.messages.forEach(msg => {
      if (msg.sender.toString() !== req.user.id.toString()) {
        msg.isRead = true;
      }
    });

    await chatroom.save();

    res.status(200).json({ success: true, message: 'Messages marked as read' });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return res.status(500).json({ success: false, message: 'Error marking messages as read', details: error.message });
  }
};
