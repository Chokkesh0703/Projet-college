import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import navigation hook
import { Button } from "../ui/button";
import { Card, CardHeader, CardContent } from "../ui/card";
import Footer from "../common/Footer"
import { FaSignOutAlt } from "react-icons/fa";

const StudentApprove = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  // Filter students based on roles
  const studentRequests = students.filter((student) => student.role === "student");
  const adminRequests = students.filter((student) => student.role === "admin");
  const facultyRequests = students.filter((student) => student.role === "faculty");

  return (
    <div className="">
      <div className="p-4 text-black text-lg flex justify-between items-center bg-[#08415C]">
        <h1 className="text-xl font-semibold text-white">Request Approvel Panel</h1>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="p-3 rounded-full flex items-center gap-2 bg-white hover:bg-gray-100 transition-colors"
        >
          <FaSignOutAlt className="text-xl" />
          <span className="hidden lg:inline">Logout</span>
        </button>
      </div>
      <div className="p-6">
        <h1 className="font-bold text-3xl">Student Request</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studentRequests.length === 0 ? (
            <p className="text-gray-500">No pending approvals.</p>
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

        <h1 className="font-bold text-3xl">Admin Request</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminRequests.length === 0 ? (
            <p className="text-gray-500">No pending approvals.</p>
          ) : (
            adminRequests.map((student) => (
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

        <h1 className="font-bold text-3xl">Faculty Request</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {facultyRequests.length === 0 ? (
            <p className="text-gray-500">No pending approvals.</p>
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

export default StudentApprove;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom"; // Import navigation hook
// import { Button } from "../ui/button";
// import { Card, CardHeader, CardContent } from "../ui/card";

// const StudentApprove = () => {
//   const [students, setStudents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchStudents();
//   }, []);

//   const fetchStudents = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/admin/students");
//       setStudents(response.data);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching students:", error);
//       setLoading(false);
//     }
//   };

//   const handleApproval = async (id) => {
//     try {
//       await axios.put(`http://localhost:8000/api/admin/approve/${id}`);

//       // Remove approved student from UI
//       setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
//     } catch (error) {
//       console.error("Error approving student:", error);
//     }
//   };

//   const handleRejection = async (id) => {
//     try {
//       await axios.delete(`http://localhost:8000/api/admin/reject/${id}`);

//       // Remove rejected student from UI
//       setStudents((prevStudents) => prevStudents.filter((student) => student._id !== id));
//     } catch (error) {
//       console.error("Error rejecting student:", error);
//     }
//   };

//   if (loading) return <p>Loading...</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>

//       {/* Back to Admin Home Button */}
//       <button
//         onClick={() => navigate("/AdminHome")}
//         className="mb-4 bg-blue-500 text-white py-2 px-4 rounded"
//       >
//         Back to Admin Home
//       </button>

//       <h1 className="font-bold text-3xl">Student Request</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {students.length === 0 ? (
//           <p className="text-gray-500">No pending approvals.</p>
//         ) : (
//           students.map((student) => (
//             <Card key={student._id} className="p-4 shadow-md rounded-lg">
//               <CardHeader>
//                 <h2 className="text-lg font-semibold">{student.name}</h2>
//                 <p className="text-gray-600">{student.email}</p>
//                 <p className="text-gray-500">Course: {student.course}</p>
//                 <h2 className="text-lg font-semibold">Role:{student.role}</h2>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-500">College ID: {student.collegeid}</p>
//                 <p className="text-gray-500">Year of Passing: {student.yearofpass}</p>
//                 <div className="flex gap-4 mt-4">
//                   <Button
//                     className="bg-green-500 hover:bg-green-600 text-white"
//                     onClick={() => handleApproval(student._id)}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     className="bg-red-500 hover:bg-red-600 text-white"
//                     onClick={() => handleRejection(student._id)}
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//       <h1 className="font-bold text-3xl">Admin Request</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {students.length === 0 ? (
//           <p className="text-gray-500">No pending approvals.</p>
//         ) : (
//           students.map((student) => (
//             <Card key={student._id} className="p-4 shadow-md rounded-lg">
//               <CardHeader>
//                 <h2 className="text-lg font-semibold">{student.name}</h2>
//                 <p className="text-gray-600">{student.email}</p>
//                 <p className="text-gray-500">Course: {student.course}</p>
//                 <h2 className="text-lg font-semibold">Role:{student.role}</h2>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-500">College ID: {student.collegeid}</p>
//                 <p className="text-gray-500">Year of Passing: {student.yearofpass}</p>
//                 <div className="flex gap-4 mt-4">
//                   <Button
//                     className="bg-green-500 hover:bg-green-600 text-white"
//                     onClick={() => handleApproval(student._id)}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     className="bg-red-500 hover:bg-red-600 text-white"
//                     onClick={() => handleRejection(student._id)}
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//       <h1 className="font-bold text-3xl">Faculty Request</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//         {students.length === 0 ? (
//           <p className="text-gray-500">No pending approvals.</p>
//         ) : (
//           students.map((student) => (
//             <Card key={student._id} className="p-4 shadow-md rounded-lg">
//               <CardHeader>
//                 <h2 className="text-lg font-semibold">{student.name}</h2>
//                 <p className="text-gray-600">{student.email}</p>
//                 <p className="text-gray-500">Course: {student.course}</p>
//                 <h2 className="text-lg font-semibold">Role:{student.role}</h2>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-gray-500">College ID: {student.collegeid}</p>
//                 <p className="text-gray-500">Year of Passing: {student.yearofpass}</p>
//                 <div className="flex gap-4 mt-4">
//                   <Button
//                     className="bg-green-500 hover:bg-green-600 text-white"
//                     onClick={() => handleApproval(student._id)}
//                   >
//                     Approve
//                   </Button>
//                   <Button
//                     className="bg-red-500 hover:bg-red-600 text-white"
//                     onClick={() => handleRejection(student._id)}
//                   >
//                     Reject
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default StudentApprove;
