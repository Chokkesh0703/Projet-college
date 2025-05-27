import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { Button, Popover, Typography } from "@mui/material";

const API_BASE_URL = "http://localhost:8000";

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState("");
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);

  const course = sessionStorage.getItem("course");
  const yearofpass = sessionStorage.getItem("yearofpass");
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (!course || !yearofpass || !userId) {
      console.warn("Missing session data");
      return;
    }

    const newSocket = io(API_BASE_URL);
    setSocket(newSocket);

    // Join chatroom
    newSocket.emit("joinRoom", { course, yearofpass });

    // Listen for incoming messages
    newSocket.on("receiveMessage", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => newSocket.disconnect(); // Cleanup on unmount
  }, [course, yearofpass, userId]);

  useEffect(() => {
    fetchMessages();
  }, [course, yearofpass]);

  const fetchMessages = async () => {
    if (!course || !yearofpass) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatroom/${course}/${yearofpass}`);

      if (response.status === 200) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !course || !yearofpass) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/chatroom/${course}/${yearofpass}/message`,
        { sender: userId, text: messageText }
      );

      if (response.status === 201) {
        setMessageText(""); // Clear input field
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Popover Code
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = sessionStorage.getItem('userToken');
        const res = await axios.get('http://localhost:8000/api/me/profile', {
          headers: {
            'x-auth-token': token,
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          }
        });
        setProfile(res.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError('Failed to load profile. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen" style={{
      backgroundColor: "#f5f0e1",
    }}>
      {/* Header */}
      <div className="p-4 text-black text-lg flex justify-between items-center" style={{
        backgroundColor: '#ffc13b',
      }}>
        <button onClick={() => navigate("/StudentHome")} className="text-black font-bold">← Back</button>
        <h1 className="text-xl font-semibold">Chatroom: {course}, {yearofpass}</h1>
      </div>

      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg max-w-xs ${msg.sender === userId ? "bg-blue-500 text-white self-end ml-auto" : "bg-gray-200 text-black"
                }`}
            >
              <a aria-describedby={id} onClick={handleClick} className="text-sm font-semibold cursor-pointer">
                {msg.sender === userId ? "You" : msg.sender.name}
              </a>
              {/* <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
              >
                <Typography sx={{ p: 2 }}>
                  {profile.username} <br />
                  {profile.email} <br />
                  {profile.role}
                </Typography>
              </Popover> */}
              <p>{msg.text}</p>
            </div>
          ))
        )}
      </div>

      {/* Input Box */}
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
          style={{
            backgroundColor: '#ffc13b',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
