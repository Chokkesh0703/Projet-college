import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentChatlist = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchChatrooms();
  }, []);

  const fetchChatrooms = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/chat/all'); // Fetch all chatrooms 
      setChatrooms(response.data.chatrooms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
      setLoading(false);
    }
  };

  const handleChatroomClick = (chatroom) => {
    // Navigate to the chatroom page
    navigate(`/Studentchatroom/${chatroom._id}`, { state: { chatroom } });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Chatrooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatrooms.length === 0 ? (
          <p className="text-gray-500">No chatrooms available.</p>
        ) : (
          chatrooms.map((chatroom) => (
            <div
              key={chatroom._id}
              onClick={() => handleChatroomClick(chatroom)}
              className="cursor-pointer border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition relative"
            >
              {/* If the chatroom has unread messages, show the dot */}
              {chatroom.unreadMessages && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
              
              <h2 className="text-xl font-semibold flex items-center">
                Chat with {chatroom.faculty.name}
              </h2>
              <p className="text-gray-600">{chatroom.faculty.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentChatlist;
