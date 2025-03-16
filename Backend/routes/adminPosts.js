import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { verifyAdmin}  from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";
import path from "path"
import fs from "fs"
import { io } from "../server.js";


const conn = mongoose.connection;
const router = express.Router();


//multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
})

const upload = multer({ storage: storage })

//  Create a Post with Media (Admin Only)
router.post("/create",  upload.single("file"), async (req, res) => {
  try {
    const token = req.header("Authorization"); //  Get token from headers
    // const userId = req.header("X-User-Id"); //  Get user ID from headers
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

  
    const userId = decoded.id; 
    console.log("User ID:", userId);

    const { text } = req.body;
    const mediaUrl = req.file ? req.file.filename : "";
    const mediaType = req.file ? (req.file.mimetype.startsWith("image") ? "image" : "video") : "none";

    const newPost = new Post({
      text,
      mediaUrl,
      mediaType,
      createdBy: userId,
    });
    // await mediaUrl.create({file :mediaUrl})
    await newPost.save();
    res.status(201).json({ message: " Post created successfully", post: newPost });
  } catch (error) {
    res.status(500).json({ error: " Failed to create post", details: error.message });
  }
});

//  2. Get All Posts (Sorted by Date)
router.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "name").populate("comments").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: " Failed to fetch posts", details: error.message });
  }
});

    

// 1. Like or Unlike a Post
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
      //  Unlike the post (remove user ID)
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      //  Like the post (add user ID)
      post.likes.push(userId.toString());
    }
    
    await post.save();
    io.emit("postUpdated", { postId: post._id, likes: post.likes.length });
    res.json({ message: "Like status updated", likes: post.likes.length });
  } catch (error) {
    console.error("Error updating like:", error);
    res.status(500).json({ error: "Failed to update like", details: error.message });
  }
});

// 2. Add a Comment
router.post("/comment/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required" });
    if (!text.trim()) return res.status(400).json({ error: "Comment cannot be empty" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = { user: userId, text, createdAt: new Date() };
    post.comments.push(newComment);

    await post.save();
    io.emit("postUpdated", post);
    res.json({ message: "Comment added", comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to add comment", details: error.message });
  }
});

// 3. Delete a Post (Admin Only)
router.delete("/delete/:postId", verifyAdmin, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    // Delete media file if it exists
    if (post.mediaUrl) {
      const filePath = path.join( "./uploads", post.mediaUrl); // Adjust path if needed
      fs.unlink(filePath, (err) => {
        if (err && err.code !== "ENOENT") {
          console.error("Error deleting file:", err);
        } else {
          console.log("Media file deleted successfully.");
        }
      });
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete post", details: error.message });
  }
});

// 4. Delete a Comment 
router.delete("/comment/:postId/:commentId", async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, Role } = req.body; // Role & userId sent from frontend

    if (!userId || !Role) {
      console.log(Role , userId)
      return res.status(400).json({ error: "Missing userId or Role" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    //  Find the comment to check ownership
    const comment = post.comments.find((c) => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    //  Admin can delete any comment, student can delete only their own
    if (Role !== "admin" && Role !== "faculty" &&  comment.user.toString() !== userId) {
      console.log(Role , userId)
      return res.status(403).json({ error: "Unauthorized to delete this comment" });
    }

    //  Remove comment from post
    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    //  Notify all clients via Socket.io
    io.emit("commentDeleted", { postId, commentId });

    res.json({ message: "Comment deleted successfully", comments: post.comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete comment", details: error.message });
  }
});

export default router;
