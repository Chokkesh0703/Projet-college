import mongoose from "mongoose";
import multer from "multer"


const PostSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    mediaUrl: { type: String }, // Stores filename (MongoDB GridFS)
    mediaType: { type: String, enum: ["image", "video", "none"], default: "none" },
    likes: { type: Number, default: 0 },
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", },
  },
  { timestamps: true }
);


const Post = mongoose.model("Post", PostSchema);
export default Post; //  Use ES6 export
