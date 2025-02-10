import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

const Chatroom = ({ userId }) => {
  const [chatroom, setChatroom] = useState(null);
  const [message, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    socket.emit("joinRoom", { userId });

    socket.on("roomJoined", (room) => {
      setChatroom(room);
      setMessages(room.message);
    });

    socket.on("loadMessages", setMessages);
    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("roomJoined");
      socket.off("newMessage");
    };
  }, [userId]);

  const sendMessage = () => {
    if (messageText.trim() && chatroom) {
      socket.emit("sendMessage", {
        chatroomId: chatroom._id,
        senderId: userId,
        text: messageText,
      });
      sendMessage("");
    }
  };

  return (
    <div>
        <span onClick={() => navigate("/StudentHome")}>--back--</span>
      <h1>Chatroom: {chatroom?.name}</h1>
      <div>
        {message.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}</strong>: {msg.text}
          </p>
        ))};
      </div>
      <input
        type="text"
        value={messageText}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chatroom;
