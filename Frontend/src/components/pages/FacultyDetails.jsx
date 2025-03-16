import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


const FacultyDetails = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const userToken = sessionStorage.getItem("token");
     const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/admin/faculties");
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            setLoading(false);
        }
    };

    const handleCreateChat = async (studentId) => {
        if (!userToken) {
            console.error("User token is missing.");
            return;
        }

        try {
            console.log('Student ID:', studentId);
            const response = await axios.post(
                'http://localhost:8000/api/chat/create',
                { studentId },
                { headers: { Authorization: `Bearer ${userToken}` } } // Pass the token here
            );
            console.log('Chatroom created or found:', response.data);
            const chatroom = response.data.chatroom;

            // Navigate to the chatroom page and pass the chatroomId
            navigate(`/Studentchatroom/${chatroom._id}`, { state: {chatroom , students} });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized: Invalid token or token expired.');
            } else {
                console.error('Error creating chatroom:', error);
            }
        }
    };
    
    if (loading) return <p>Loading...</p>;
    const facultyRequests = students.filter((student) => student.role === "faculty");
    return (
        <div>
            <h1 className="font-bold text-3xl">Faculty Request</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyRequests.length === 0 ? (
                    <p className="text-gray-500">No Faculty.</p>
                ) : (
                    facultyRequests.map((student) => (
                        <Card key={student._id} className="p-4 shadow-md rounded-lg">
                            <CardHeader>
                                <h2 className="text-lg font-semibold">{student.name}</h2>
                                <p className="text-gray-600">{student.email}</p>
                                <p className="text-gray-500">Course: {student.course}</p>
                                <h2 className="text-lg font-semibold">Role: {student.role}</h2>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-500">College ID: {student.collegeid}</p>
                                <p className="text-gray-500">Year of Passing: {student.yearofpass}</p>
                            </CardContent>
                            <Button 
                                    onClick={() => handleCreateChat(student._id)} // Pass the student ID to create chatroom
                                    className="mt-2 bg-blue-500 text-white"
                                >
                                    Start Chat
                                </Button>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default FacultyDetails
