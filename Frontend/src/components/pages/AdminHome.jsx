import React, { useEffect } from "react";
import { FaSignOutAlt, FaEnvelope, FaNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Ensure authentication state is loaded before checking user role
  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/"); // Redirect to login if not an admin
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout(); // Clear authentication state
  };

  return (
    <div className="flex flex-row md:flex-row justify-center items-center h-screen w-screen space-y-7 md:space-y-0 md:space-x-7 p-10 bg-">
      <div
        className="w-full md:w-1/3 text-center h-1/3 md:h-3/6 cursor-pointer hover:bg-gray-100 flex flex-col justify-center items-center"
        onClick={handleLogout}
      >
        <FaSignOutAlt className="text-4xl mb-2" />
        Logout
      </div>
      <div
        className="w-full md:w-1/3 h-1/3 md:h-3/6 text-center cursor-pointer hover:bg-gray-100 flex flex-col justify-center items-center"
        onClick={() => navigate("/StudentApprove")}
      >
        <FaEnvelope className="text-4xl mb-2" />
        Request
      </div>
      <div
        className="w-full md:w-1/3 text-center h-1/3 md:h-3/6 text-blue-500 cursor-pointer hover:bg-gray-100 flex flex-col justify-center items-center"
        onClick={() => navigate("/Adminpost")}
      >
        <FaNewspaper className="text-4xl mb-2" />
        Posts
      </div>
    </div>
  );
};

export default AdminHome;
