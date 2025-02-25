import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import banner from '../../../assets/banner.png'

// React UI
// import RotatingText from '../../ui/RotatingText'

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [adminId, setAdminId] = useState("");
  const [adminPassword, setadminPassword] = useState("");
  const [email, setEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [showAdminLogin, setShowAdminLogin] = useState(false);//Toggle

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
        navigate("/AdminHome");
      } else {
        alert("Invalid Admin ID or Password.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Login failed. Please try again.");
    }
  };

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
        navigate("/StudentHome");
      } else {
        alert("Invalid credentials! Please try again.");
      }
    } catch (error) {
      console.error("Student login error:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="">
      <Header />
      <div className="flex items-center justify-center mt-8 h-screen bg-s bg-cover bg-no-repeats from-blue-500 to-purple-600" style={{
        backgroundImage: `url(${banner})`,
      }}>
        <div className="w-full max-w-4xl pl-10 pr-10 pb-10 rounded-xl shadow-lg bg-banner" style={{
          backgroundColor: 'rgba(30, 61, 89, 0.5)',
        }}>
          <h1 className="text-3xl font-bold text-white text-center mb-8 m-10">Welcome!</h1>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Student Login */}
            <div className="p-6 bg-gray-100 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Student Login</h2>
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full text-white font-semibold py-2 rounded-lg transition"
                  style={{
                    backgroundColor: '#ffc13b',
                    color: 'black'
                  }}
                >
                  Login
                </button>
              </form>
            </div>

            {/* Admin Login */}
            {showAdminLogin && (

              <div className="p-6 bg-gray-100 rounded-lg shadow">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Admin Login</h2>
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Admin ID"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={adminPassword}
                    onChange={(e) => setadminPassword(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full  text-white font-semibold py-2 rounded-lg transition"
                    style={{
                      backgroundColor: '#ffc13b',
                      color: 'black'
                    }}
                  >
                    Login
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Register Button */}
          <div className="flex justify-center align-middle gap-4">
            <button
              onClick={() => navigate("/commomRegistrations")}
              className="mt-4 bg-white text-black font-semibold py-2 px-6 rounded-lg transition"
            >
              Sign In
            </button>
            {/* Toggle Button */}
            <button
              onClick={() => setShowAdminLogin(!showAdminLogin)}
              className="mt-4 bg-white text-black font-semibold py-2 px-6 rounded-lg transition"
            >
              {showAdminLogin ? 'Hide Admin Login' : 'Show Admin Login'}
            </button>
          </div>
        </div>
      </div>
      {/* <Banner/> */}
      <Footer />
    </div>
  );
};

export default LoginPage;
