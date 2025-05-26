import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const FacultyDetails = () => {
  const [students, setStudents] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("All");
  const userToken = sessionStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchName, selectedCourse, students]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/faculties"
      );
      setStudents(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching students:", error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let facultyOnly = students.filter((s) => s.role === "faculty");

    if (searchName.trim()) {
      facultyOnly = facultyOnly.filter((s) =>
        s.name.toLowerCase().includes(searchName.toLowerCase())
      );
    }

    if (selectedCourse !== "All") {
      facultyOnly = facultyOnly.filter((s) => s.course === selectedCourse);
    }

    setFiltered(facultyOnly);
  };

  const handleCreateChat = async (studentId) => {
    if (!userToken) return console.error("User token is missing.");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/chats/create",
        { studentId },
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
      const chatroom = response.data.chatroom;
      navigate(`/Studentchatroom/${chatroom._id}`, {
        state: { chatroom, students },
      });
    } catch (error) {
      console.error(
        error.response?.status === 401
          ? "Unauthorized: Invalid token."
          : "Chatroom error:",
        error
      );
    }
  };

  const getUniqueCourses = () => {
    const courseSet = new Set(students.map((s) => s.course).filter(Boolean));
    return ["All", ...courseSet];
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="font-bold text-3xl mb-4">Faculty Requests</h1>

      {/* Search & Filter */}
      <div className="px-10 flex flex-col md:flex-row justify-between gap-4 mb-20">
        <Input
          placeholder="Search by name..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="md:w-1/2"
        />
        <div className="w-full md:w-1/3">
          <label className="block mb-1 text-gray-700">Filter by course:</label>
          <Select onValueChange={setSelectedCourse} value={selectedCourse}>
            <SelectTrigger className="w-full h-full">
              <SelectValue placeholder="Filter by course" />
              <SelectContent>
              {getUniqueCourses().map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
            </SelectTrigger>
          </Select>
        </div>
      </div>

      {/* Faculty Cards */}
      <div className="grid grid-cols-1 mx-10 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <p className="text-gray-500">No matching faculty found.</p>
        ) : (
          filtered.map((faculty) => (
            <Card key={faculty._id} className="p-4 shadow-md rounded-lg">
              <CardHeader>
                <h2 className="text-lg font-semibold">{faculty.name}</h2>
                <p className="text-gray-600">{faculty.email}</p>
                <p className="text-gray-500">Course: {faculty.course}</p>
                <p className="text-gray-500">Role: {faculty.role}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">College ID: {faculty.collegeid}</p>
                <p className="text-gray-500">
                  Year of Passing: {faculty.yearofpass}
                </p>
              </CardContent>
              <Button
                onClick={() => handleCreateChat(faculty._id)}
                className="mt-2 bg-blue-500 text-white w-full"
              >
                Start Chat
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default FacultyDetails;
