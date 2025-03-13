import express from "express";
import User from "../models/User.js";
import { Server } from "socket.io";

const facultychatroomroute = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", 
      methods: ["GET", "POST", "PUT"],
    },
  });

const facultychatroomroute = express.Router();


  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
  
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
}

export default facultychatroomroute;