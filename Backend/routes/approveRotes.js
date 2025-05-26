// routes/approvalRoutes.js
import express from "express";
import {
  getUnapprovedStudents,
  getApprovedFaculties,
  getApprovedStudents,
  approveUser,
  rejectUser,
} from "../controllers/approvalController.js";

const approverouter = express.Router();

approverouter.get("/admin/students", getUnapprovedStudents);
approverouter.get("/admin/faculties", getApprovedFaculties);
approverouter.get("/admin/studentsdetails", getApprovedStudents);
approverouter.put("/admin/approve/:id", approveUser);
approverouter.delete("/admin/reject/:id", rejectUser);

export default approverouter;
