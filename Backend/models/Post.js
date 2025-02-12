import mongoose from "mongoose";



const PostSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    mediaUrl: { type: String }, // Stores filename (MongoDB GridFS)
    mediaType: { type: String, enum: ["image", "video", "none"], default: "none" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", },
  },
  { timestamps: true }
);


const Post = mongoose.model("Post", PostSchema);
export default Post; //  Use ES6 export
