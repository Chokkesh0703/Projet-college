// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login/Login";
import Student from "./components/student/Student"
import StudentHome from "./components/student/StudentHome";
import AdminHome from "./components/admin/AdminHome";
import Register from "./components/student/register";
import CommonRegistration from "./components/common/CommonRegistration"
import StudentApprove from "./components/student/StudentApprove";
import FacultyRegister from './components/faculty/FacultyRegister'
import AdminRoute from "./routes/AdminRoute";
import FacultyRoute from "./routes/FacultyRoute";
import Faculty from "./components/faculty/Faculty"
import StudentRoute from "./routes/StudentRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "./index.css";
import AdminPost from "./components/admin/Adminpost";
import Chatroom from "./components/pages/Chatroom";
import RouteWrapper from "./components/common/RouterWrapper";

// Header Import 
import About from './components/common/About'
import Contact from "./components/common/Contact";
import HowToUse from './components/common/howToUse'
import AdminRegister from "./components/admin/AdminRegister";
import FacultyHome from "./components/faculty/FacultyHome";
import FacultyDetails from "./components/faculty/FacultyDetails";
import StudentDetails from "./components/student/StudentDetails";
import FacultyChatroom from "./components/faculty/FacultyChatroom";
import PrivateRoute from "./routes/PrivateRoute";
import FacultyChatlist from "./components/faculty/Facultychatlist";
import Studentchatroom from "./components/student/Studentchatroom";
import StudentChatlist from "./components/student/Studentchatlist";
import ProfileView from "./components/profile/ProfileView";
import ProfileForm from "./components/profile/ProfileForm";

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
      {/* Profile Routes */}
      <Route path="/ProfileView" element={<StudentRoute><ProfileView /></StudentRoute>} />
      <Route path="/ProfileFrom" element={<StudentRoute><ProfileForm /></StudentRoute>} />

      {/* Protected Routes */}
      <Route path="/Student" element={<StudentRoute><RouteWrapper><Student/></RouteWrapper></StudentRoute>}></Route>
      <Route path="/StudentHome" element={<StudentRoute><RouteWrapper><StudentHome user={user} /></RouteWrapper></StudentRoute>} />
      <Route path="/FacultyDetails" element={<StudentRoute><RouteWrapper><FacultyDetails user={user} /></RouteWrapper></StudentRoute>} />
      <Route path="/Chatroom" element={<StudentRoute>< Chatroom user={user} /></StudentRoute>} />
      <Route path="/Studentchatroom/:id" element={<StudentRoute><RouteWrapper><Studentchatroom user={user} /></RouteWrapper></StudentRoute>} />
      <Route path="/StudentChatlist" element={<StudentRoute><RouteWrapper><StudentChatlist user={user} /></RouteWrapper></StudentRoute>} />

      <Route path="/FacultyHome" element={<FacultyRoute><FacultyHome user={user} /></FacultyRoute>} />
      <Route path="/StudentDetails" element={<FacultyRoute><RouteWrapper><StudentDetails user={user} /></RouteWrapper></FacultyRoute>} />
      <Route path="/FacultyChatroom/:id" element={<FacultyRoute><RouteWrapper><FacultyChatroom user={user} /></RouteWrapper></FacultyRoute>} />
      <Route path="/Facultychatlist" element={<FacultyRoute><RouteWrapper><FacultyChatlist user={user} /></RouteWrapper></FacultyRoute>} />
      <Route path="/Faculty" element={<FacultyRoute><RouteWrapper><Faculty user={user} /></RouteWrapper></FacultyRoute>} />

      {/* Admin-Only Routes */}
      <Route path="/AdminHome" element={<AdminRoute><AdminHome user={user} /></AdminRoute>} />
      <Route path="/StudentApprove" element={<AdminRoute><StudentApprove user={user} /></AdminRoute>} />
      <Route path="/Adminpost" element={<AdminRoute><AdminPost user={user} /></AdminRoute>} />
    </Routes>

    
  );
};

export default App;
