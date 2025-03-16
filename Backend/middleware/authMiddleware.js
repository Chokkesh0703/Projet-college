import jwt from "jsonwebtoken";
import User from "../models/User.js"; // Ensure this is correctly imported

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ message: "Access Denied" });

    // Extract the token from "Bearer <token>"
    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid Token Format" });
    }

    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET);

    // Fetch user from database to check role
    const admin = await User.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "User not found" });

    if (admin.role !== "admin" && admin.role !== "faculty") {
      return res.status(403).json({ message: "Access Denied, Admins Only" });
    }

    req.admin = admin; // Store admin details in req
    next();
  } catch (error) {
    console.error("Admin verification error:", error);
    res.status(401).json({ message: "Invalid Token", error: error.message });
  }
};

export { verifyAdmin };






