import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/User.js";
import adminRouter from "./routes/adminRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import approverouter from "./routes/approveRotes.js";
import bcrypt from "bcryptjs";
import bodyParser from "body-parser";
import postsRoutes from "./routes/adminPosts.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import path from "path"

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
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
app.use("/api", approverouter);

// Test Route
app.get("/", (req, res) => {
  res.send("Hello from the server!");
});

// Register User
app.post("/register", async (req, res) => {
  const { name, course, collegeid, unid, yearofpass, email, phoneno, studentPassword } = req.body;
  try {
    const check = await User.findOne({ email });
    if (check) {
      return res.json("exist");
    }

    const hashedPassword = await bcrypt.hash(studentPassword, 10);
    const newUser = new User({
      name,
      course,
      collegeid,
      unid,
      yearofpass,
      email,
      phoneno,
      studentPassword: hashedPassword,
      approve: false,
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
export { app, server, io,  }; // Named Export

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

// Start Server
const PORT = 8000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
