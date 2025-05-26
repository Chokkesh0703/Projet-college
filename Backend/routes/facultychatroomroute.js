import { Router } from "express";
import authenticate from "../middleware/authenticate.js";
import {
  createChatroom,
  getFacultyChatrooms,
  getStudentChatrooms,
  sendMessage,
  markAsRead,
} from "../controllers/facultyChatroomController.js";

const Facultychatroomrouter = Router();

export default function setupFacultyChatroomRoutes(io) {
  Facultychatroomrouter.post("/create", authenticate, createChatroom);
  Facultychatroomrouter.get("/all/:facultyId", getFacultyChatrooms);
  Facultychatroomrouter.get("/student/:studentId", getStudentChatrooms);
  Facultychatroomrouter.post("/send_message", authenticate, sendMessage(io));
  Facultychatroomrouter.post("/mark_as_read", authenticate, markAsRead);

  return Facultychatroomrouter;
}
