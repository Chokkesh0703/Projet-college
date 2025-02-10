import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";

const StudentApprove = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleApproval = async (id) => {
    try {
      await axios.put(`http://localhost:8000/api/admin/approve/${id}`);
      
      // Remove approved student from UI
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error approving student:", error);
    }
  };

  const handleRejection = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/reject/${id}`);

      // Remove rejected student from UI
      setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error rejecting student:", error);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard - Approve Students</h1>
      
      {/* Back to Admin Home Button */}
      <button
        onClick={() => navigate("/AdminHome")}
        className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        Back to Admin Home
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.length === 0 ? (
          <p className="text-gray-500">No pending approvals.</p>
        ) : (
          students.map((student) => (
            <Card key={student._id} className="p-4 shadow-md rounded-lg">
              <CardHeader>
                <h2 className="text-lg font-semibold">{student.name}</h2>
                <p className="text-gray-600">{student.email}</p>
                <p className="text-gray-500">Course: {student.course}</p>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">College ID: {student.collegeid}</p>
                <p className="text-gray-500">Year of Passing: {student.yearofpass}</p>
                <div className="flex gap-4 mt-4">
                  <Button
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleApproval(student._id)}
                  >
                    Approve
                  </Button>
                  <Button
                    className="bg-red-500 hover:bg-red-600 text-white"
                    onClick={() => handleRejection(student._id)}
                  >
                    Reject
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

export default StudentApprove;
