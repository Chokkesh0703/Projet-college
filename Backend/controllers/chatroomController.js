import Chatroom from "../models/Message.js";

// Fetch messages
export const getChatroomMessages = async (req, res) => {
  try {
    const { course, yearofpass } = req.params;

    if (!course || !yearofpass) {
      return res.status(400).json({ error: "Missing course or yearofpass parameter" });
    }

    const chatroom = await Chatroom.findOne({ course, yearofpass })
      .populate("messages.sender", "name");

    if (!chatroom) {
      return res.status(404).json({ message: "No chatroom found for this course and year of passing" });
    }

    res.json(chatroom);
  } catch (error) {
    res.status(500).json({ error: "Error fetching chatroom", details: error.message });
  }
};

// Send message and emit with Socket.IO
export const postChatMessage = (io) => async (req, res) => {
  try {
    const { sender, text } = req.body;
    const { course, yearofpass } = req.params;

    if (!sender || !text) {
      return res.status(400).json({ error: "Sender and text are required" });
    }

    let chatroom = await Chatroom.findOne({ course, yearofpass });

    if (!chatroom) {
      chatroom = new Chatroom({ course, yearofpass, messages: [], members: [sender] });
      await chatroom.save();
    }

    if (!chatroom.members.includes(sender)) {
      chatroom.members.push(sender);
    }

    const newMessage = { sender, text, timestamp: new Date() };
    chatroom.messages.push(newMessage);
    await chatroom.save();

    io.to(`${course}-${yearofpass}`).emit("receiveMessage", newMessage);

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Error sending message", details: error.message });
  }
};
