import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  collegeid: { type: String, required: true },
  unid: { type: String, required: true },
  yearofpass: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneno: { type: String, required: true },
  Password: { type: String, required: true },
  approve: { type: Boolean, default: false },
  chatroom:[{type: mongoose.Schema.ObjectId, ref:"Message"}],
  role: { type: String, enum: ["admin", "student"], required :true },
});
 
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("studentPassword")) return next();
//   this.studentPassword = await bcrypt.hash(this.studentPassword, 10);
//   next();
// });


// Create the User model
const User = mongoose.model("User", userSchema);

export default User; 
