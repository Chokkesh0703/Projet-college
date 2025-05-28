import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  const course = sessionStorage.getItem("course");
  const yearofpass = sessionStorage.getItem("yearofpass");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!course || !yearofpass || !userId) return;

    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    newSocket.emit("joinRoom", { course, yearofpass });

    newSocket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => newSocket.disconnect();
  }, [course, yearofpass, userId]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!course || !yearofpass) return;
      try {
        const res = await axios.get(`${API_BASE_URL}/api/chatroom/${course}/${yearofpass}`);
        if (res.status === 200) {
          setMessages(res.data.messages);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    fetchMessages();
  }, [course, yearofpass]);

  const sendMessage = async () => {
    if (!messageText.trim() || !course || !yearofpass) return;

    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/chatroom/${course}/${yearofpass}/message`,
        { sender: userId, text: messageText }
      );

      if (res.status === 201) {
        setMessageText("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex flex-col h-[78vh]" style={{ backgroundColor: "#f5f0e1" }}>
      {/* Header */}
      <div className="p-4 text-black text-lg flex justify-between items-center" style={{ backgroundColor: '#08415C' }}>
        <h1 className="text-xl font-semibold text-white">Chatroom: {course}, {yearofpass}</h1>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = msg.sender === userId || msg.sender?._id === userId;
            const senderName = isCurrentUser ? "You" : (msg.sender?.name || "Unknown");

            return (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-xs ${isCurrentUser
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-black"
                }`}
              >
                <p className="text-sm font-semibold">{senderName}</p>
                <p>{msg.text}</p>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white flex">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 p-2 rounded-lg"
        />
        <button
          onClick={sendMessage}
          className="ml-2 text-black font-bold p-2 rounded-lg"
          style={{ backgroundColor: '#ffc13b' }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
