import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { io } from "../server.js";

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// 1. Create a Post with Media (Admin Only)
router.post("/create", upload.single("file"), async (req, res) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Authorization token missing" });

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    const userId = decoded.id;

    const { text } = req.body;
    const mediaUrl = req.file ? req.file.filename : "";
    const mediaType = req.file
      ? (req.file.mimetype.startsWith("image") ? "image" : "video")
      : "none";

    const newPost = new Post({
      text,
      mediaUrl,
      mediaType,
      createdBy: userId,
    });

    await newPost.save();
    io.emit("newPost", newPost);
    res.status(201).json({ message: "Post created successfully", post: newPost });
    // req.io.emit("newPost", savedPost);
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post", details: error.message });
  }
});

// 2. Get All Posts (Sorted by Date)
router.get("/all", async (req, res) => {
  try {
    // Populate createdBy name and comments.user fields
    const posts = await Post.find()
      .populate("createdBy", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts", details: error.message });
  }
});

// 3. Like or Unlike a Post
router.put("/like/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.likes.includes(userId.toString())) {
      // Unlike
      post.likes = post.likes.filter(id => id.toString() !== userId.toString());
    } else {
      // Like
      post.likes.push(userId.toString());
    }

    await post.save();

    // Emit updated likes count
    io.emit("postLiked", { postId: post._id, likes: post.likes.length });

    res.json({ message: "Like status updated", likes: post.likes.length });
  } catch (error) {
    console.error("Update like error:", error);
    res.status(500).json({ error: "Failed to update like", details: error.message });
  }
});

// 4. Add a Comment
router.post("/comment/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!text || !text.trim()) return res.status(400).json({ error: "Comment cannot be empty" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    io.emit("commentAdded", { postId, comments: post.comments });

    res.json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Failed to add comment", details: error.message });
  }
});

// 5. Delete a Post (Admin Only)
router.delete("/delete/:postId", verifyAdmin, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // Delete media file if exists
    if (post.mediaUrl) {
      const filePath = path.join(process.cwd(), "uploads", post.mediaUrl);
      fs.unlink(filePath, err => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting media file:", err);
        } else {
          console.log("Media file deleted successfully.");
        }
      });
    }

    await Post.findByIdAndDelete(postId);

    io.emit("postDeleted", { postId });

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Failed to delete post", details: error.message });
  }
});

// 6. Delete a Comment
router.delete("/comment/:postId/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, Role } = req.body;

    if (!userId || !Role) {
      return res.status(400).json({ error: "Missing userId or Role" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    // Admin or faculty can delete any comment; user can delete their own comment only
    if (Role !== "admin" && Role !== "faculty" && comment.user.toString() !== userId) {
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    post.comments = post.comments.filter(c => c._id.toString() !== commentId);
    await post.save();

    io.emit("commentDeleted", { postId, commentId });

    res.json({ message: "Comment deleted successfully", comments: post.comments });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({ error: "Failed to delete comment", details: error.message });
  }
});

export default router;
