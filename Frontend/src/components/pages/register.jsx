import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation

const Register = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    collegeid: "",
    unid: "",
    yearofpass: "",
    email: "",
    phoneno: "",
    studentPassword: ""
  });

  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // Check if the user has already registered (prevents persistence on refresh)
    const isRegistered = sessionStorage.getItem("registered");
    if (isRegistered) {
      setRegistered(false); // Reset form state on refresh
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8000/register", formData);

      if (res.data === "exist") {
        alert("Already registered!");
      } else if (res.data === "notexist") {
        setRegistered(true); // Show success message
        sessionStorage.setItem("registered", "true"); // Store status
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Student Registration</h1>
      
      {!registered ? (
        <form onSubmit={submit} className="flex flex-col gap-3 w-80">
          <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
          <input type="text" name="course" placeholder="Course" onChange={handleChange} required />
          <input type="text" name="collegeid" placeholder="College ID" onChange={handleChange} required />
          <input type="text" name="unid" placeholder="University Register Number" onChange={handleChange} required />
          <input type="number" name="yearofpass" placeholder="Year of Passout" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="text" name="phoneno" placeholder="Phone Number" onChange={handleChange} required />
          <input type="password" name="studentPassword" placeholder="Password" onChange={handleChange} required />
          <button type="submit" className="bg-blue-500 text-white py-2 rounded">Register</button>
        </form>
      ) : (
        <div className="text-center">
          <h2 className="text-green-600 text-lg font-semibold">Successfully Registered!</h2>
          <button
            onClick={() => {
              sessionStorage.removeItem("registered"); // Clear status
              navigate("/");
            }}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Back to Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Register;
