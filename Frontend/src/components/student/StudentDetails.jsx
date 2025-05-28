import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';
import { TextField } from '@mui/material';

const StudentDetails = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('All');
  const [filterYear, setFilterYear] = useState('All');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();
  const userToken = sessionStorage.getItem('token');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/studentsdetails');
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching students:', error);
      setLoading(false);
    }
  };

  const handleCreateChat = async (studentId) => {
    if (!userToken) {
      console.error('User token is missing.');
      return;
    }

    try {
      console.log('Creating chatroom for student ID:', studentId);
      const response = await axios.post(
        'http://localhost:8000/api/chats/create',
        { studentId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const chatroom = response.data.chatroom;
      navigate(`/FacultyChatroom/${chatroom._id}`, { state: { chatroom, students } });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized: Invalid token or token expired.');
      } else {
        console.error('Error creating chatroom:', error);
      }
    }
  };

  if (loading) return <p>Loading...</p>;

  const studentRequests = students.filter((student) => student.role === 'student');

  // Unique filters for dropdowns
  const courses = ['All', ...new Set(studentRequests.map((s) => s.course))];
  const years = ['All', ...new Set(studentRequests.map((s) => s.yearofpass))];

  const filteredStudents = studentRequests.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.yearofpass.toString().includes(searchTerm);

    const matchesCourse = filterCourse === 'All' || student.course === filterCourse;
    const matchesYear = filterYear === 'All' || student.yearofpass.toString() === filterYear;

    return matchesSearch && matchesCourse && matchesYear;
  });

  return (
    <div>
      <div className="p-4 text-black text-lg flex justify-between items-center bg-[#08415C]">
        <h1 className="text-xl font-semibold text-white">Students Chatroom</h1>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="p-3 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 px-3 py-3 my-3 mx-3">
        <TextField
          variant='filled'
          type="text"
          placeholder="Search by name, email, course, or year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />

        <select
          value={filterCourse}
          onChange={(e) => setFilterCourse(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          {courses.map((course, i) => (
            <option key={i} value={course}>
              {course}
            </option>
          ))}
        </select>

        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="border p-2 rounded w-full md:w-1/4"
        >
          {years.map((year, i) => (
            <option key={i} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-3 py-3 my-3 mx-3">
        {filteredStudents.length === 0 ? (
          <p className="text-gray-500">No students found.</p>
        ) : (
          filteredStudents.map((student) => (
            <Card key={student._id} className="p-4 shadow-md rounded-lg">
              <CardHeader>
                <h2 className="text-lg font-semibold">{student.name}</h2>
                <p className="text-gray-600">{student.email}</p>
                <p className="text-gray-600">Phone: {student.phone}</p>
                <p className="text-gray-500">Course: {student.course}</p>
                <p className="text-gray-500">Year of Passing: {student.yearofpass}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">College ID: {student.collegeid}</p>
              </CardContent>
              <Button
                onClick={() => handleCreateChat(student._id)}
                className="mt-2 bg-yellow-400 text-zinc-950"
              >
                Start Chat
              </Button>
            </Card>
          ))
        )}
      </div>
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-yellow-400 p-4 shadow-md">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => {
                setShowLogoutConfirm(true);
                setMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
            >
              <FaSignOutAlt className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-11/12 sm:w-auto">
            <h3 className="text-xl font-bold mb-4">Confirm Logout</h3>
            <p className="mb-6">Are you sure you want to logout?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-4 py-2 bg-[#ffc13b] rounded hover:bg-[#e6ac35] transition-colors"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
