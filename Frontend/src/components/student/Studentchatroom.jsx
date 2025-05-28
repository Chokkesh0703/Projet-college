import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

// Initialize socket once
const socket = io("http://localhost:8000");

const Studentchatroom = () => {
  const location = useLocation();
  const { chatroom } = location.state || {};

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  const user = sessionStorage.getItem("user");
  const userId = sessionStorage.getItem("userId");

  // Scroll to bottom when chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  useEffect(() => {
    if (!chatroom) return;

    // Join the room
    socket.emit("join_room", chatroom._id);

    // Load previous messages
    const handlePreviousMessages = (messages) => {
      setChat(messages);
    };

    // Receive real-time messages
    const handleNewMessage = (newMessage) => {
      setChat((prev) => [...prev, newMessage]);
    };

    socket.on("load_previous_messages", handlePreviousMessages);
    socket.on("receive_message", handleNewMessage);

    // Cleanup on unmount
    return () => {
      socket.emit("leave_room", chatroom._id);
      socket.off("load_previous_messages", handlePreviousMessages);
      socket.off("receive_message", handleNewMessage);
    };
  }, [chatroom]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        chatroomId: chatroom._id,
        sendername: user,
        sender: userId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      socket.emit("send_message", chatMessage);
      setMessage(""); // Clear input after sending");
    }
  };

  // Mark all messages as read
  const markMessagesAsRead = async () => {
    try {
      await fetch("http://localhost:8000/api/chats/mark_as_read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        body: JSON.stringify({ chatroomId: chatroom._id }),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    if (chatroom) {
      markMessagesAsRead();
    }
  }, [chatroom]);

  return (
    <div className="">
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">
          Chat with {chatroom.student.name || "Faculty"}
        </h2>

        {/* Chat Messages */}
        <div className="chat-window bg-white shadow-lg p-4 rounded-lg h-[80vh] overflow-y-auto">
          {chat.length === 0 ? (
            <p className="text-gray-500">No messages yet</p>
          ) : (
            chat.map((chatItem, index) => {
              const isCurrentUser = chatItem.sender === userId;
              const alignmentClass = isCurrentUser
                ? "ml-auto text-right"
                : "mr-auto text-left";
              const readStatusClass = chatItem.isRead
                ? isCurrentUser
                  ? "bg-blue-200"
                  : "bg-gray-200"
                : isCurrentUser
                  ? "bg-blue-400"
                  : "bg-gray-400";

              return (
                <div
                  key={index}
                  className={`p-2 mb-2 rounded-lg max-w-xs ${readStatusClass} ${alignmentClass}`}
                >
                  <div className="font-semibold text-sm mb-1">
                    {isCurrentUser ? "You" : chatItem.sendname}
                  </div>
                  <div>{chatItem.message}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {chatItem.timestamp &&
                      !isNaN(new Date(chatItem.timestamp)) ? (
                      new Date(chatItem.timestamp).toLocaleString("en-US", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })
                    ) : (
                      "Just now"
                    )}
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Field */}
        <div className="chat-input mt-4 flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="w-full border rounded-l-lg p-2 focus:outline-none"
          />
          <button
            onClick={handleSendMessage}
            className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-r-lg hover:bg-yellow-500"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Studentchatroom;
