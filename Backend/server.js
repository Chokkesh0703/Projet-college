import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Models
import Post from "./models/Post.js";
import Chats from "./models/Chat.js";

// Routes
import adminRouter from "./routes/adminRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import facultyRouter from "./routes/facultyRoutes.js";
import approverouter from "./routes/approveRotes.js";
import postRoutes from "./routes/postRoutes.js";
import setupChatroomRoutes from "./routes/chatroom.js";
import Studentchatroomroutes from "./routes/studentchatroomroutes.js";
import profilerouter from "./routes/profileRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Socket Setup
import setupSocket from "./routes/socket.js";

// Load Environment Variables
dotenv.config();

// Initialize App
const app = express();
const server = http.createServer(app);
const io = setupSocket(server); // Attach socket to server

// Path Utilities
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(join(__dirname, "uploads")));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/react-project")
  .then(() => console.log(" Connected to MongoDB"))
  .catch((err) => console.error(" MongoDB Error:", err));

// Attach io instance to every request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api", approverouter);
app.use("/api/posts", postRoutes);
app.use("/api/chats", Studentchatroomroutes);
app.use("/api/me", profilerouter);
app.use("/api/login", authRoutes);
app.use("/api/users", userRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Socket.IO Handlers
io.on("connection", (socket) => {
  // console.log(` Socket connected: ${socket.id}`);

  // --- Like or Unlike Post ---
  socket.on("likePost", async ({ postId, userId }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) return;

      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id !== userId);
      } else {
        post.likes.push(userId);
      }

      await post.save();
      io.emit("postUpdated", post);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  });

  // --- Add Comment ---
  socket.on("addComment", async ({ postId, userId, text }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) return;

      post.comments.push({ user: userId, text });
      await post.save();
      io.emit("postUpdated", post);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  // --- Create Post ---
  socket.on("createPost", async (postData) => {
    try {
      const newPost = new Post(postData);
      await newPost.save();
      io.emit("newPost", newPost);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });

  // --- Group Chat Room Join (Course-Year Based) ---
  socket.on("joinRoom", ({ course, yearofpass }) => {
    const room = `${course}-${yearofpass}`;
    socket.join(room);
    // console.log(`User ${socket.id} joined room: ${room}`);
  });

  // --- Faculty-Student 1:1 Chatroom Join ---
  socket.on("join_room", async (chatroomId) => {
    socket.join(chatroomId);
    // console.log(`User joined chatroom: ${chatroomId}`);
    try {
      const chatroom = await Chats.findById(chatroomId);
      if (chatroom) {
        socket.emit("load_previous_messages", chatroom.messages);
      }
    } catch (error) {
      console.error("Error loading previous messages:", error);
    }
  });

  // --- Send 1:1 Chat Message ---
  socket.on("send_message", async ({ chatroomId, sender, message, sendername }) => {
    try {
      const chatroom = await Chats.findById(chatroomId);
      if (chatroom) {
        chatroom.messages.push({ sender: sender, message, sendname: sendername });
        await chatroom.save();
        io.to(chatroomId).emit("receive_message", { sender, message, sendername });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // --- Handle Disconnect ---
  socket.on("disconnect", () => {
    // console.log("User disconnected:", socket.id);
  });
});

// --- Chatroom API Setup ---
const chatroomRouter = setupChatroomRoutes(io);
app.use("/api/chatroom", chatroomRouter);

// --- Start Server ---
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(` Server running on port ${PORT}`));

// Export for testing or use elsewhere
export { io };
