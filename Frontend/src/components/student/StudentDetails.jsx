import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const StudentDetails = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); 
    
    
    // Assuming the user token is stored in local storage
    const userToken = sessionStorage.getItem('token'); // Retrieve the user token

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/admin/studentsdetails");
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
            navigate(`/FacultyChatroom/${chatroom._id}`, { state: {chatroom , students} });
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.error('Unauthorized: Invalid token or token expired.');
            } else {
                console.error('Error creating chatroom:', error);
            }
        }
    };
    

    if (loading) return <p>Loading...</p>;

    const studentRequests = students.filter((student) => student.role === "student");

    return (
        <div>
            <h1 className="font-bold text-3xl">Student Request</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentRequests.length === 0 ? (
                    <p className="text-gray-500">No Students.</p>
                ) : (
                    studentRequests.map((student) => (
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
    );
}

export default StudentDetails;
