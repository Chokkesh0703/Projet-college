import mongoose from "mongoose";

//  Message Schema
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Message sender
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

//  Chatroom Schema
const chatroomSchema = new mongoose.Schema({
    course: { type: String, required: true }, // Course-based chatroom
    yearofpass: { type: String, required: true }, // Graduation year-based chatroom
    messages: [messageSchema], // Store previous messages
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Students in chatroom
});

//  Chatroom Model
const Chatroom = mongoose.model("Chatroom", chatroomSchema);

export default Chatroom;


