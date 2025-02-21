import React, { useEffect } from "react";
import { FaSignOutAlt, FaEnvelope, FaNewspaper } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Header from "../common/Header";
import Footer from "../common/Footer";

// import BgAdmin from '../../assets/BgAdmin.png'
// import BgAdmin2 from '../../assets/BgAdmin2.png'
// import BgAdmin3 from '../../assets/BgAdmin3.png'

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
    <div className="bg-cover bg-no-repeat" style={{
      // backgroundImage:`url(${BgAdmin2})`
    }}>

      <Header />
      <div className="container mx-auto mt-40 p-6 bg-white shadow-lg mt-10">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sivananda Sarma Memorial RV College</h2>
        <p className="text-gray-700 leading-relaxed mb-4">The nucleus of holistic education since 1991. With ‘360-degree Education for Wholeness’ as our foundation, we started out in 1984 to empower passionate students in the fields of commerce, business administration, and computer applications.</p>
        <p className="text-gray-700 leading-relaxed mb-4">Today, we offer numerous undergraduate, postgraduate, and research programmes that promote all-round development while driving innovations and research across domains.</p>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Vision</h3>
        <p className="text-gray-700 leading-relaxed mb-4">Inclusive education for the holistic development of individuals to meet societal requirements.</p>
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Mission</h3>
        <p className="text-gray-700 leading-relaxed mb-4">Committed to impart skill- and value-based education to students, through the best of academicians and professionals, to empower them to face the challenges of the competitive world.</p>
      </div>
      <div className="flex justify-center items-center mt-11 font-bold text-5xl">Admin Dashboard</div>
      <div className="flex flex-row md:flex-row justify-center items-center h-80 space-y-7 md:space-y-0 md:space-x-7 p-10">
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
      <Footer />
    </div>
  );
};

export default AdminHome;
