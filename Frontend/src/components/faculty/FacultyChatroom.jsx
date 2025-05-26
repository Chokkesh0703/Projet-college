import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";

// Initialize socket connection
const socket = io("http://localhost:8000");

const FacultyChatroom = () => {
 
  const location = useLocation();
  const { chatroom } = location.state || {}; // Extracting chatroom and students from state passed by routing
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const chatEndRef = useRef(null);

  // Get the logged-in user info from session storage
  const user = sessionStorage.getItem("user");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!chatroom) return;

    // Join the specific chatroom
    socket.emit("join_room", chatroom._id);

    // Load previous messages when joining the room
    socket.on("load_previous_messages", (messages) => {
      setChat(messages);
    });

    // // Handle incoming messages
    // socket.on("receive_message", (newMessage) => {
    //   setChat((prev) => [...prev, newMessage]);
    // });

    // Cleanup when the component unmounts or chatroom changes
    return () => {
      socket.emit("leave_room", chatroom._id);
    };
  }, [chatroom]);

  // Scroll to the latest message whenever the chat updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const chatMessage = {
        chatroomId: chatroom._id,
        sendername: user, // 
        senderId: userId,
        message: message.trim(),
        timestamp: new Date().toISOString(),
      };

      // Emit message to the server via socket
      socket.emit("send_message", chatMessage);

      // Update the chat locally to display the new message
      setChat((prev) => [...prev, chatMessage]);
      setMessage(""); // Clear the message input
    }
  };

  const markMessagesAsRead = async () => {
    // API call to mark messages as read in the backend
    try {
      await fetch("http://localhost:8000/api/chat/mark_as_read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Assuming JWT token is stored in session storage
        },
        body: JSON.stringify({ chatroomId: chatroom._id }),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  useEffect(() => {
    markMessagesAsRead();
  }, [chatroom]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">
        Chat with {chatroom.student.name}
      </h2>

      {/* Chat Window */}
      <div className="chat-window bg-white shadow-lg p-4 rounded-lg h-96 overflow-y-auto">
        {chat.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          chat.map((chatItem, index) => (
            <div
              key={index}
              className={`chat-bubble p-2 mb-2 rounded-lg ${
                chatItem.senderId === userId
                  ? "bg-blue-200 text-right self-end"
                  : "bg-gray-200 text-left"
              }`}
            >
              <div>
                <strong>
                  {chatItem.senderId === userId ? "You" : chatItem.sendname}
                </strong>
              </div>
              <div>{chatItem.message}</div>
              <span className="text-xs text-gray-500">
                {new Date(chatItem.timestamp).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Message Input */}
      <div className="chat-input mt-4 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full border rounded-l-lg p-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default FacultyChatroom;
