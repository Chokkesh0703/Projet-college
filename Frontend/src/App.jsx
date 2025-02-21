// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login/index";
import StudentHome from "./components/pages/StudentHome";
import AdminHome from "./components/pages/AdminHome";
import Register from "./components/pages/Register";
import StudentApprove from "./components/pages/StudentApprove";
import AdminRoute from "./routes/AdminRoute";
import StudentRoute from "./routes/StudentRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import AdminPost from "./components/pages/Adminpost";
import Chatroom from "./components/pages/Chatroom";

// Header Import 
import About from './components/common/About'
import Contact from "./components/common/Contact";
import HowToUse from './components/common/howToUse'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

// Separate component to access auth context
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />

      {/* Header Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<HowToUse />} />

      {/* Protected Routes */}
      <Route path="/StudentHome" element={<StudentRoute><StudentHome user={user} /></StudentRoute>} />
      <Route path="/Chatroom" element={<StudentRoute>< Chatroom /></StudentRoute>} />
      <Route path="/AdminHome" element={<AdminRoute><AdminHome /></AdminRoute>} />

      {/* Admin-Only Routes */}
      <Route path="/StudentApprove" element={<AdminRoute><StudentApprove /></AdminRoute>} />
      <Route path="/Adminpost" element={<AdminRoute><AdminPost /></AdminRoute>} />
    </Routes>
  );
};

export default App;
