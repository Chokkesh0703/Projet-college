import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import User from "./models/User.js";
import Post from "./models/Post.js";
import Chats from "./models/Chat.js";

import adminRouter from "./routes/adminRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import facultyRouter from "./routes/facultyRoutes.js";
import approverouter from "./routes/approveRotes.js";
import postsRoutes from "./routes/adminPosts.js";
import setupSocket from "./routes/socket.js";
import setupChatroomRoutes from "./routes/chatroom.js";
import Facultychatroomrouter from "./routes/facultychatroomroute.js";
import Studentchatroomroutes from "./routes/studentchatroomroutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(join(__dirname, "uploads")));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/react-project")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Error:", err));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api", approverouter);
app.use("/api/posts", postsRoutes);
app.use("/api/chat", Facultychatroomrouter);
app.use("/api/chats", Studentchatroomroutes)

app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Register API
app.post("/register", async (req, res) => {
  const { name, course, collegeid, unid, yearofpass, email, phoneno, Password, role } = req.body;
  try {
    const check = await User.findOne({ email });
    if (check) return res.json("exist");

    if (!["admin", "student", "faculty"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new User({
      name, course, collegeid, unid, yearofpass, email, phoneno,
      Password: hashedPassword, approve: false, role,
    });

    await newUser.save();
    res.json("notexist");
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json("server error");
  }
});

// Get All Users
app.get("/collection", async (req, res) => {
  try {
    const datas = await User.find();
    res.json(datas);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

// Attach io to request object for routes to access
app.use((req, res, next) => {
  req.io = io;
  next();
});

// --- SOCKET.IO HANDLERS ---

io.on("connection", (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // Handle Like/Unlike Post
  socket.on("likePost", async ({ postId, userId }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) return;

      // Toggle like/unlike
      if (post.likes.includes(userId)) {
        post.likes = post.likes.filter((id) => id !== userId);
      } else {
        post.likes.push(userId);
      }

      await post.save();

      // Broadcast updated likes to all clients
      io.emit("postUpdated", post);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  });

  // Handle Add Comment
  socket.on("addComment", async ({ postId, userId, text }) => {
    try {
      const post = await Post.findById(postId);
      if (!post) return;

      // Add comment (you might want to include user info for comment)
      post.comments.push({ user: userId, text });
      await post.save();

      // Broadcast updated post with new comment
      io.emit("postUpdated", post);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  });

  // Handle New Post Created
  // If posts are created via REST API, you can emit event from there.
  // Alternatively, listen here for new posts created via socket.
  socket.on("createPost", async (postData) => {
    try {
      const newPost = new Post(postData);
      await newPost.save();

      // Emit to all clients the new post
      io.emit("newPost", newPost);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  });

  // Join Course-Year Room for Group Chat
  socket.on("joinRoom", ({ course, yearofpass }) => {
    const room = `${course}-${yearofpass}`;
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Faculty-Student 1:1 Chat join
  socket.on("join_room", async (chatroomId) => {
    socket.join(chatroomId);
    console.log(`User joined chatroom: ${chatroomId}`);
    try {
      const chatroom = await Chats.findById(chatroomId);
      if (chatroom) {
        socket.emit("load_previous_messages", chatroom.messages);
      }
    } catch (error) {
      console.error("Error loading previous messages:", error);
    }
  });

  // Send message in chatroom
  socket.on("send_message", async (chatMessage) => {
    const { chatroomId, senderId, message, sendername } = chatMessage;
    try {
      const chatroom = await Chats.findById(chatroomId);
      if (chatroom) {
        chatroom.messages.push({ sender: senderId, message, sendname: sendername });
        await chatroom.save();
        io.to(chatroomId).emit("receive_message", { senderId, message, sendername });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Setup chatroom router (for course/year chatrooms)
const chatroomRouter = setupChatroomRoutes(io);
app.use("/api/chatroom", chatroomRouter);

// Start Server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export { io };
