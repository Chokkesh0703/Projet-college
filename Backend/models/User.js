import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, },
  course: { type: String, },
  collegeid: { type: String, },
  unid: { type: String, },
  yearofpass: { type: String, },
  email: { type: String, unique: true },
  phoneno: { type: String, },
  Password: { type: String, },
  approve: { type: Boolean, default: false },
  chatroom: [{ type: mongoose.Schema.ObjectId, ref: "Message" }],
  role: { type: String, enum: ["admin", "student", "faculty"], },
});



// Create the User model
const User = mongoose.model("User", userSchema);

export default User; 
