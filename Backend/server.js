import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import adminRouter from "./routes/adminRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import facultyRouter from "./routes/facultyRoutes.js";
import approverouter from "./routes/approveRotes.js";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import postsRoutes from "./routes/adminPosts.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path"
import setupSocket from "./routes/socket.js";
import setupChatroomRoutes from "./routes/chatroom.js";
import Facultychatroomrouter from "./routes/facultychatroomroute.js";
import Chats from "./models/Chat.js";


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = setupSocket(server);

app.use(bodyParser.json());

const fileName = fileURLToPath(import.meta.url);
const dirName = dirname(fileName);

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads",express.static(path.join(dirName, "uploads")));



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/react-project")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/faculty", facultyRouter);
app.use("/api", approverouter);


// Test Route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Register User
app.post("/register", async (req, res) => {
  const { name, course, collegeid, unid, yearofpass, email, phoneno, Password, role } = req.body;
  try {
    const check = await User.findOne({ email });
    if (check) {
      return res.json("exist");
    }
    if (!["admin", "student","faculty"].includes(role)) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const hashedPassword = await bcrypt.hash(Password, 10);
    const newUser = new User({
      name,
      course,
      collegeid,
      unid,
      yearofpass,
      email,
      phoneno,
      Password: hashedPassword,
      approve: false,
      role,
    });

    await newUser.save();
    res.json("notexist");
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json("server error");
  }
});

// Fetch Users
app.get("/collection", async (req, res) => {
  try {
    const datas = await User.find();
    res.json(datas);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

import Post from "./models/Post.js" 

//  Export Correctly
export { app,  io,  }; // Named Export

app.use("/api/posts", postsRoutes);

// Like Post
io.on("connection", (socket) => {
  socket.on("likePost", async ({ postId }) => {
    const post = await Post.findById(postId);
    if (post) {
      post.likes += 1;
      await post.save();
      io.emit("updatePostLikes", { postId, likes: post.likes });
    }
  });

  // Add Comment
  socket.on("addComment", async ({ postId, userId, text }) => {
    const post = await Post.findById(postId);
    if (post) {
      post.comments.push({ userId, text });
      await post.save();
      io.emit("updatePostComments", { postId, comments: post.comments });
    }
  });
});


//  Attach Socket.io instance to routes
const chatroomRouter = setupChatroomRoutes(io);
app.use("/api/chatroom", chatroomRouter);

//  Handle Socket.io connections
io.on("connection", (socket) => {
  // console.log("A user connected:", socket.id);

  // Join chatroom based on course and year
  socket.on("joinRoom", ({ course, yearofpass }) => {
    const room = `${course}-${yearofpass}`;
    socket.join(room);
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Listen for new socket connections faculty and student one to one interaction
io.on('connection', (socket) => {
  // console.log('A user connected:', socket.id);

  // Join a chatroom
  socket.on('join_room', async (chatroomId) => {
      socket.join(chatroomId);
      console.log(`User joined chatroom: ${chatroomId}`);

      try {
        // Fetch previous messages from the chatroom
        const chatroom = await Chats.findById(chatroomId);
        if (chatroom) {
            // Send previous messages to the user who joined
            socket.emit('load_previous_messages', chatroom.messages);
        }
    } catch (error) {
        console.error('Error loading previous messages:', error);
    }

  });


  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // Listen for new messages
  socket.on('send_message', async (chatMessage) => {
      const { chatroomId, senderId, message, sendername } = chatMessage;
      console.log(chatMessage)

      try {
          // Save the message to the database
          const chatroom = await Chats.findById(chatroomId);
          if (chatroom) {
              chatroom.messages.push({ sender: senderId, message , sendname : sendername });
              await chatroom.save();

              // Emit the message to the chatroom
              io.to(chatroomId).emit('receive_message', { senderId, message, sendername });
          }
      } catch (error) {
          console.error('Error sending message:', error);
      }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
  });
});

// Add your API routes
app.use('/api/chat', Facultychatroomrouter);

// Start Server
const PORT = 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
