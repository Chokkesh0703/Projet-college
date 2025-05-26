import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FacultyChatlist = () => {
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUnread, setFilterUnread] = useState('All'); // 'All' or 'Unread'

  const navigate = useNavigate();
  const facultyId = sessionStorage.getItem('userId');

  useEffect(() => {
    if (facultyId) {
      fetchChatrooms(facultyId);
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
      const response = await axios.get(`http://localhost:8000/api/chats/all/${facultyId}`);
      setChatrooms(response.data.chatrooms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
      setLoading(false);
    }
  };

  const handleChatroomClick = (chatroom) => {
    navigate(`/FacultyChatroom/${chatroom._id}`, { state: { chatroom } });
  };

  if (loading) return <p>Loading...</p>;

  // Filter chatrooms based on search term and unread filter
  const filteredChatrooms = chatrooms.filter((chatroom) => {
    const studentName = chatroom.student?.name?.toLowerCase() || '';
    const studentEmail = chatroom.student?.email?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();

    const matchesSearch = studentName.includes(search) || studentEmail.includes(search);
    const matchesUnread = filterUnread === 'All' || (filterUnread === 'Unread' && chatroom.unreadMessages);

    return matchesSearch && matchesUnread;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Available Chatrooms</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by student name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-2/3"
        />

        <select
          value={filterUnread}
          onChange={(e) => setFilterUnread(e.target.value)}
          className="border p-2 rounded w-full md:w-1/3"
        >
          <option value="All">Show All</option>
          <option value="Unread">Only Unread</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChatrooms.length === 0 ? (
          <p className="text-gray-500">No chatrooms available.</p>
        ) : (
          filteredChatrooms.map((chatroom) => (
            <div
              key={chatroom._id}
              onClick={() => handleChatroomClick(chatroom)}
              className="cursor-pointer border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition relative"
            >
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
