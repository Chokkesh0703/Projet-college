import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../ui/card';

const FacultyDetails = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/admin/students");
            setStudents(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching students:", error);
            setLoading(false);
        }
    };
    if (loading) return <p>Loading...</p>;
    const facultyRequests = students.filter((student) => student.role === "student");
    return (
        <div>
            <h1 className="font-bold text-3xl">Student Request</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {facultyRequests.length === 0 ? (
                    <p className="text-gray-500">No Students.</p>
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
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}

export default FacultyDetails
