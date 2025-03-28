import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyChatlist = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const facultyId = sessionStorage.getItem("userId");


  useEffect(() => {
    if (facultyId) {
      fetchChatrooms(facultyId); // Pass the studentId to the function
    } else {
      console.error('Faculty ID is not provided');
    }
  }, [facultyId]);

  const fetchChatrooms = async (facultyId) => {
    if (!facultyId) {
      console.error('Faculty ID is not provided');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/chat/all/${facultyId}`);
      setChatrooms(response.data.chatrooms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
      setLoading(false);
    }
  };

  const handleChatroomClick = (chatroom) => {
    // Navigate to the chatroom page
    navigate(`/FacultyChatroom/${chatroom._id}`, { state: { chatroom } });
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
                Chat with {chatroom.student.name}
              </h2>
              <p className="text-gray-600">{chatroom.student.email}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyChatlist;
