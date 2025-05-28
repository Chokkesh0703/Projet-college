import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';

const StudentChatlist = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");

  const navigate = useNavigate();
  const studentId = sessionStorage.getItem("userId");

  useEffect(() => {
    if (studentId) {
      fetchChatrooms(studentId);
    } else {
      console.error('Student ID is not provided');
    }
  }, [studentId]);

  const fetchChatrooms = async (studentId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/chats/student/${studentId}`);
      setChatrooms(response.data.chatrooms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
      setLoading(false);
    }
  };

  const handleChatroomClick = (chatroom) => {
    navigate(`/Studentchatroom/${chatroom._id}`, { state: { chatroom } });
  };

  const filteredChatrooms = chatrooms.filter((room) => {
    const searchMatch =
      room.faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.faculty.email.toLowerCase().includes(searchTerm.toLowerCase());

    const filterMatch =
      filter === "All" ||
      (filter === "Unread" && room.unreadMessages) ||
      (filter === "Read" && !room.unreadMessages);

    return searchMatch && filterMatch;
  });

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container w-screen">
      <div className="p-4 text-black text-lg flex justify-between items-center w-screen" style={{ backgroundColor: '#08415C' }}>
        <h1 className="text-xl font-semibold text-white">Available Chatrooms</h1>
      </div>
      <div className="px-10 flex flex-col md:flex-row gap-4 mb-6 mt-12">
        <TextField
          variant='filled'
          type="text"
          placeholder="Search by faculty name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          <option value="All">All</option>
          <option value="Unread">Unread</option>
          <option value="Read">Read</option>
        </select>
      </div>

      {/* Chatroom Cards */}
      <div className="px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChatrooms.length === 0 ? (
          <p className="text-gray-500">No chatrooms match your search/filter.</p>
        ) : (
          filteredChatrooms.map((chatroom) => (
            <div
              key={chatroom._id}
              onClick={() => handleChatroomClick(chatroom)}
              className="cursor-pointer border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition relative"
            >
              {chatroom.unreadMessages && (
                <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 rounded-full" title="Unread messages"></span>
              )}
              <h2 className="text-xl font-semibold">
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
