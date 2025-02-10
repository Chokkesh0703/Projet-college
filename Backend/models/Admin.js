import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';



const AdminSchema = new mongoose.Schema({
  adminId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: true }, //  Add this field
}, { timestamps: true });

//🔹 Hash password before saving
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Admin = mongoose.model('Admin', AdminSchema);
export default Admin;

