import React from "react";
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

      {/* Protected Routes */}
      <Route path="/StudentHome" element={<StudentRoute><StudentHome user={user} /></StudentRoute>} />
      <Route path="/AdminHome" element={<AdminRoute><AdminHome /></AdminRoute>} />

      {/* Admin-Only Routes */}
      <Route path="/StudentApprove" element={<AdminRoute><StudentApprove /></AdminRoute>} />
      <Route path="/Adminpost" element={<AdminRoute><AdminPost /></AdminRoute>} />
    </Routes>
  );
};

export default App;
