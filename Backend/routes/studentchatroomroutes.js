import { Router } from 'express';
import authenticate from '../middleware/authenticate.js';
import {
  createChatroom,
  getAllChatroomsForFaculty,
  getAllChatroomsForStudent,
  sendMessage,
  markMessagesAsRead
} from '../controllers/studentChatroomController.js';

const router = Router();

router.post('/create', authenticate, createChatroom);
router.get('/all/:facultyId', getAllChatroomsForFaculty);
router.get('/student/:studentId', getAllChatroomsForStudent);
router.post('/send_message', authenticate, sendMessage);
router.post('/mark_as_read', authenticate, markMessagesAsRead);

export default router;
