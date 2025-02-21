import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8000";

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
    Password: "",
    role: "student", // Default role selection
  });

  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    const isRegistered = sessionStorage.getItem("registered");
    if (isRegistered) {
      setRegistered(false);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value.trim() });
  };

  const validateForm = () => {
    if (!formData.email.includes("@")) {
      alert("Enter a valid email address");
      return false;
    }
    if (!/^\d{10}$/.test(formData.phoneno)) {
      alert("Enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, formData);

      if (res.data === "exist") {
        alert("Already registered!");
      } else if (res.data === "notexist") {
        setRegistered(true);
        sessionStorage.setItem("registered", "true");
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("Server error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{
      backgroundColor: '#f5f0e1',
    }}>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Registration</h1>

        {!registered ? (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <input type="text" name="name" placeholder="Name" onChange={handleChange} className="p-2 border rounded" required />
            <input type="text" name="course" placeholder="Course/designation" onChange={handleChange} className="p-2 border rounded" required />
            <input type="text" name="collegeid" placeholder="College ID" onChange={handleChange} className="p-2 border rounded" required />
            <input type="text" name="unid" placeholder="University Register Number" onChange={handleChange} className="p-2 border rounded" />
            <input type="number" name="yearofpass" placeholder="Year of Passout" onChange={handleChange} className="p-2 border rounded" required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" required />
            <input type="text" name="phoneno" placeholder="Phone Number" onChange={handleChange} className="p-2 border rounded" required />
            <input type="password" name="Password" placeholder="Password" onChange={handleChange} className="p-2 border rounded" required />

            {/* Role Selection Dropdown */}
            <select name="role" value={formData.role} onChange={handleChange} className="p-2 border rounded">
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>

            <button type="submit" className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Register</button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-green-600 text-lg font-semibold">Successfully Registered!</h2>
            <button
              onClick={() => {
                sessionStorage.removeItem("registered");
                navigate("/");
              }}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div >
  );
};

export default Register;
