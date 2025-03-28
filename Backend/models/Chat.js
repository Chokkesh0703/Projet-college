import mongoose from 'mongoose';
const { Schema } = mongoose;

// Define a schema for the individual messages
const MessageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sendname: {
    type: String,
  },
  message: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false // By default, messages are unread
  }
});

// Define the Chat schema
const ChatSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Refers to User model (student)
    required: true
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Refers to User model (faculty)
    required: true
  },
  messages: [MessageSchema], // Array of messages using the MessageSchema
  studentUnreadCount: {
    type: Number,
    default: 0 // Tracks how many messages are unread by the student
  },
  facultyUnreadCount: {
    type: Number,
    default: 0 // Tracks how many messages are unread by the faculty
  },
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});


const Chats = mongoose.model('Chats', ChatSchema);
export default Chats;
