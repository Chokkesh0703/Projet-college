// routes/chatroomRoutes.js
import express from "express";
import {
  getChatroomMessages,
  postChatMessage,
} from "../controllers/chatroomController.js";

const router = express.Router();

export default function setupChatroomRoutes(io) {
  router.get("/:course/:yearofpass", getChatroomMessages);
  router.post("/:course/:yearofpass/message", postChatMessage(io));
  return router;
}
