// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login/index";
import StudentHome from "./components/pages/StudentHome";
import AdminHome from "./components/pages/AdminHome";
import Register from "./components/pages/Register";
import CommonRegistration from "./components/common/CommonRegistration"
import StudentApprove from "./components/pages/StudentApprove";
import FacultyRegister from './components/pages/FacultyRegister'
import AdminRoute from "./routes/AdminRoute";
import FacultyRoute from "./routes/FacultyRoute";
import StudentRoute from "./routes/StudentRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import AdminPost from "./components/pages/Adminpost";
import Chatroom from "./components/pages/Chatroom";
import RouteWrapper from "./components/common/RouterWrapper";

// Header Import 
import About from './components/common/About'
import Contact from "./components/common/Contact";
import HowToUse from './components/common/howToUse'
import AdminRegister from "./components/pages/AdminRegister";
import FacultyHome from "./components/pages/FacultyHome";
import FacultyDetails from "./components/pages/FacultyDetails";
import StudentDetails from "./components/pages/StudentDetails";

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
      <Route path="/commomRegistrations" element={<CommonRegistration />}></Route>
      <Route path="/register" element={<Register />} />
      <Route path="/adminregister" element={<AdminRegister />}></Route>
      <Route path="/facultyregister" element={<FacultyRegister />}></Route>

      {/* Header Routes */}
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/help" element={<HowToUse />} />

      {/* Protected Routes */}
      <Route path="/StudentHome" element={<RouteWrapper><StudentRoute><StudentHome user={user} /></StudentRoute></RouteWrapper>} />
      <Route path="/FacultyDetails" element={<RouteWrapper><StudentRoute><FacultyDetails user={user} /></StudentRoute></RouteWrapper>} />
      <Route path="/Chatroom" element={<StudentRoute>< Chatroom /></StudentRoute>} />
      <Route path="/FacultyHome" element={<FacultyRoute><FacultyHome /></FacultyRoute>} />
      <Route path="/StudentDetails" element={<RouteWrapper><FacultyRoute><StudentDetails /></FacultyRoute></RouteWrapper>} />

      {/* Admin-Only Routes */}
      <Route path="/AdminHome" element={<AdminRoute><AdminHome /></AdminRoute>} />
      <Route path="/StudentApprove" element={<AdminRoute><StudentApprove /></AdminRoute>} />
      <Route path="/Adminpost" element={<AdminRoute><AdminPost /></AdminRoute>} />
    </Routes>
  );
};

export default App;
