import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import Post from "../models/Post.js";
import { verifyAdmin}  from "../middleware/authMiddleware.js";
import jwt from "jsonwebtoken";


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

  
    const userId = decoded.id; //  Extract user ID from token instead of headers
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
    const posts = await Post.find().populate("createdBy", "name").populate("comments.user", "name").sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: " Failed to fetch posts", details: error.message });
  }
});

    


//  4. Like a Post
router.put("/like/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { action } = req.body; // action = "like" or "unlike"

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: " Post not found" });

    // Update like count
    if (action === "like") {
      post.likes += 1;
    } else if (action === "unlike" && post.likes > 0) {
      post.likes -= 1;
    }

    await post.save();
    res.json({ message: " Like count updated", likes: post.likes });
  } catch (error) {
    res.status(500).json({ error: " Failed to update like count", details: error.message });
  }
});

//  5. Add a Comment
router.post("/comment/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: " Post not found" });

    post.comments.push({ user: userId, text });
    await post.save();

    res.json({ message: " Comment added", post });
  } catch (error) {
    res.status(500).json({ error: " Failed to add comment", details: error.message });
  }
});

//  6. Delete a Post (Admin Only)
router.delete("/:postId", verifyAdmin, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);

    if (!post) return res.status(404).json({ error: " Post not found" });

    if (post.mediaUrl) {
      const file = await upload.files.findOne({ filename: post.mediaUrl });
      if (file) await upload.delete(file._id);
    }

    await Post.findByIdAndDelete(postId);
    res.json({ message: " Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: " Failed to delete post", details: error.message });
  }
});

//  7. Delete a Comment (Admin Only)
router.delete("/comment/:postId/:commentId",verifyAdmin, async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ error: " Post not found" });

    post.comments = post.comments.filter((comment) => comment._id.toString() !== commentId);
    await post.save();

    res.json({ message: " Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: " Failed to delete comment", details: error.message });
  }
});

export default router;
