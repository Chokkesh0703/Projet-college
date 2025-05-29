import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
import path from "path";
import fs from "fs";
import { io } from "../server.js";

// Create Post
export const createPost = async (req, res) => {
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
  } catch (error) {
    console.error("Create post error:", error);
    res.status(500).json({ error: "Failed to create post", details: error.message });
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name")
      .populate("comments.user", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    res.status(500).json({ error: "Failed to fetch posts", details: error.message });
  }
};

// Like or Unlike Post
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const isLiked = post.likes.includes(userId.toString());

    post.likes = isLiked
      ? post.likes.filter(id => id.toString() !== userId.toString())
      : [...post.likes, userId.toString()];

    await post.save();

    io.emit("postLiked", { postId: post._id, likes: post.likes.length });
    res.json({ message: "Like status updated", likes: post.likes.length });
  } catch (error) {
    console.error("Update like error:", error);
    res.status(500).json({ error: "Failed to update like", details: error.message });
  }
};

// Add Comment (updated to populate user info)
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!userId || !text?.trim()) return res.status(400).json({ error: "Invalid input" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newComment = {
      user: userId,
      text: text.trim(),
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    // Fetch updated post with populated comment users
    const updatedPost = await Post.findById(postId)
      .populate("comments.user", "name")
      .populate("createdBy", "name");

    io.emit("commentAdded", { postId, comments: updatedPost.comments });
    res.json({ message: "Comment added", comments: updatedPost.comments });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ error: "Failed to add comment", details: error.message });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.mediaUrl) {
      const filePath = path.join(process.cwd(), "uploads", post.mediaUrl);
      fs.unlink(filePath, err => {
        if (err && err.code !== "ENOENT") console.error("File deletion error:", err);
      });
    }

    await Post.findByIdAndDelete(postId);

    io.emit("postDeleted", { postId });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({ error: "Failed to delete post", details: error.message });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId, Role } = req.body;

    if (!userId || !Role) return res.status(400).json({ error: "Missing userId or Role" });

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const comment = post.comments.find(c => c._id.toString() === commentId);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

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
};
