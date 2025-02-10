import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  name: String,
  course: { type: String, required: true },
  yearofpass: { type: String, required: true },
  message:[
    {
      sender:{type: mongoose.Schema.Types.ObjectId, ref:"User"},
      text: String,
      timestamp:{type:Date, default:Date.now}}
  ],
  members:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}]
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
