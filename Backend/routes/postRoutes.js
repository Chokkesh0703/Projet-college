import express from "express";
import multer from "multer";
import path from "path";
import {
  createPost,
  getAllPosts,
  toggleLikePost,
  addComment,
  deletePost,
  deleteComment
} from "../controllers/postController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './uploads'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Routes
router.post("/create", upload.single("file"), createPost);
router.get("/all", getAllPosts);
router.put("/like/:postId", toggleLikePost);
router.post("/comment/:postId", addComment);
router.delete("/delete/:postId", verifyAdmin, deletePost);
router.delete("/comment/:postId/:commentId", deleteComment);

export default router;
