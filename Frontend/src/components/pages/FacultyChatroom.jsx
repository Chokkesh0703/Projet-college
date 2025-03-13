import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";

const FacultyChatroom = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/faculty/students");
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            setLoading(false);
        }
    };

    const chat = () => {

    }

    if (loading) return <p>Loading...</p>;
    
    const studentRequests = students.filter((student) => student.role === "student");

    return (
        <div className="p-6">
            <h1 className="text-4xl font-bold mb-4">Faculty Dashboard</h1>

            {/* Back to Admin Home Button */}
            <button
                onClick={() => navigate("/FacultyHome")}
                className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
                Back to Faculty Home
            </button>

            <h1 className="font-bold text-3xl">Student List</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {studentRequests.length === 0 ? (
                    <p className="text-gray-500">No Students.</p>
                ) : (
                    studentRequests.map((student) => (
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
                                <div className="flex gap-4 mt-4">
                                    <Button
                                        className="bg-green-500 hover:bg-green-600 text-white"
                                        onClick={() => chat(student._id)}
                                    >
                                        Chat
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
};

export default FacultyChatroom;