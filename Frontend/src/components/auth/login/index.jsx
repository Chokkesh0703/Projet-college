import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import banner from "../../../assets/banner.png";
import { TextField } from "@mui/material";
import { Button } from "material";

// Simple Login components for email, Google, and Facebook (for illustration purposes)
const StudentLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const handleStudentLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/student/login", {
        email: email,
        password: studentPassword,
      });

      if (res.data.status === "success" && res.data.token) {
        login({ role: "student", email }, res.data.token);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userId", res.data.ID);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("user", res.data.name);
        sessionStorage.setItem("course", res.data.course);
        sessionStorage.setItem("yearofpass", res.data.yearofpass);
        localStorage.setItem('userToken', res.data.token);
        navigate("/Student");
      } else {
        alert("Invalid credentials! Please try again.");
      }
    } catch (error) {
      console.error("Student login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  return (
    <div>
      {/* Student Login */}
      <div className="p-6 bg-gray-100 rounded-lg shadow sm:mx-10 lg:mx-20 xl:mx-40">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Student Login
        </h2>
        <form onSubmit={handleStudentLogin} className="space-y-4">
          <TextField
            variant="filled"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-6 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"            
            style={{margin:"8px 0 8px 0"}}
            required
          />
          <TextField
            variant="filled"
            type="password"
            placeholder="Password"
            value={studentPassword}
            onChange={(e) => setStudentPassword(e.target.value)}
            className="mt-6 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"            
            style={{margin:"8px 0 8px 0"}}
            required
          />
          <button
            type="submit"
            className="w-full text-white font-semibold py-4 rounded-lg transition"
            style={{
              backgroundColor: "#ffc13b",
              color: "black",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [adminId, setAdminId] = useState("");
  const [adminPassword, setadminPassword] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/admin/login", {
        email: adminId,
        password: adminPassword,
      });

      if (res.data.message === "Login successful") {
        login({ role: "admin", id: adminId }, res.data.token);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userId", res.data.ID);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("user", res.data.name);
        localStorage.setItem('userToken', res.data.token);
        navigate("/AdminHome");
      } else {
        alert("Invalid Admin ID or Password.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="p-6 bg-gray-100 rounded-lg shadow sm:mx-10 lg:mx-20 xl:mx-40">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Admin Login
        </h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <TextField
            variant="filled"
            type="text"
            placeholder="Admin ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            style={{margin:'8px 0 8px 0'}}
            required
          />
          <TextField
            variant="filled"
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setadminPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            style={{margin:'8px 0 8px 0'}}
            required
          />
          <button
            type="submit"
            className="w-full text-white font-semibold py-4 rounded-lg transition"
            style={{
              backgroundColor: "#ffc13b",
              color: "black",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const FacultyLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [adminId, setAdminId] = useState("");
  const [adminPassword, setadminPassword] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/faculty/login", {
        email: adminId,
        password: adminPassword,
      });

      if (res.data.message === "Login successful") {
        login({ role: "faculty", id: adminId }, res.data.token);
        sessionStorage.setItem("token", res.data.token);
        sessionStorage.setItem("userId", res.data.ID);
        sessionStorage.setItem("role", res.data.role);
        sessionStorage.setItem("user", res.data.name);
        localStorage.setItem('userToken', res.data.token);
        navigate("/Faculty");
      } else {
        alert("Invalid Faculty ID or Password.");
      }
    } catch (error) {
      console.error("Faculty login error:", error);
      alert("Login failed. Please try again.");
    }
  };
  return (
    <div>
      <div className="p-6 bg-gray-100 rounded-lg shadow sm:mx-10 lg:mx-20 xl:mx-40">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Faculty Login
        </h2>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <TextField
            variant="filled"
            type="text"
            placeholder="Faculty ID"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            style={{margin:"8px 0 8px 0"}}
            required
          />
          <TextField
            variant="filled"
            type="password"
            placeholder="Password"
            value={adminPassword}
            onChange={(e) => setadminPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            style={{margin:"8px 0 8px 0"}}
            required
          />
          <button
            type="submit"
            className="w-full text-white font-semibold py-4 rounded-lg transition"
            style={{
              backgroundColor: "#ffc13b",
              color: "black",
            }}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

const LoginTabs = () => {
  const [activeTab, setActiveTab] = useState("email");
  const navigate = useNavigate();

  return (
    <div className=" w-full">

      <div
        className="flex items-center justify-center min-h-screen bg-cover bg-no-repeat bg-gradient-to-br from-blue-500 to-purple-600 "
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div
          className="w-full m-2  max-w-4xl px-4 py-10 sm:px-10 rounded-xl shadow-lg relative "
          style={{ backgroundColor: "rgba(30, 61, 89, 0.5)" }}
        >
          <h1 className="text-3xl font-bold text-white text-center mb-8">
            Welcome!
          </h1>

          {/* Tab Buttons */}
          <div className="mb-5 flex flex-col sm:flex-row gap-3 text-sm sm:text-base justify-around">
            <button
              onClick={() => setActiveTab("email")}
              className="px-4 py-2 bg-black text-white font-bold rounded transition transform hover:scale-105"
            >
              Student Login
            </button>
            <button
              onClick={() => setActiveTab("google")}
              className="px-4 py-2 bg-black text-white font-bold rounded transition transform hover:scale-105"
            >
              Admin Login
            </button>
            <button
              onClick={() => setActiveTab("facebook")}
              className="px-4 py-2 bg-black text-white font-bold rounded transition transform hover:scale-105"
            >
              Faculty Login
            </button>
          </div>

          {/* Conditional rendering based on active tab */}
          <div>
            {activeTab === "email" && <StudentLogin />}
            {activeTab === "google" && <AdminLogin />}
            {activeTab === "facebook" && <FacultyLogin />}
          </div>
          {/* Register Button */}
          <div className="flex justify-center items-center align-middle gap-4">
            <p className="mt-4 bg-black text-white font-semibold py-2 px-6 rounded-lg transition">Don&apos;t Have an Account ? </p>
            <button
              onClick={() => navigate("/commomRegistrations")}
              className="mt-4 bg-yellow-400 text-black font-semibold py-2 px-6 rounded-lg transition"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
      
      {/* <Banner/> */}
    </div>
  );
};

export default LoginTabs;
