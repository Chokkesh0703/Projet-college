import express from "express";
import { studentLogin } from "../controllers/studentAuthController.js";

const StudentLoginRouter = express.Router();

StudentLoginRouter.post("/login", studentLogin);

export default StudentLoginRouter;
