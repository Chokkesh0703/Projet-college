// import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login/Login";
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
import FacultyChatroom from "./components/pages/FacultyChatroom";
import PrivateRoute from "./routes/PrivateRoute";
import FacultyChatlist from "./components/pages/Facultychatlist";
import Studentchatroom from "./components/pages/Studentchatroom";
import StudentChatlist from "./components/pages/Studentchatlist";

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
      <Route path="/StudentHome" element={<StudentRoute><RouteWrapper><StudentHome user={user} /></RouteWrapper></StudentRoute>} />
      <Route path="/FacultyDetails" element={<StudentRoute><RouteWrapper><FacultyDetails user={user} /></RouteWrapper></StudentRoute>} />
      <Route path="/Chatroom" element={<StudentRoute>< Chatroom user={user}/></StudentRoute>} />
      <Route path="/Studentchatroom/:id" element={<StudentRoute><RouteWrapper><Studentchatroom user={user}/></RouteWrapper></StudentRoute>}/>
      <Route path="/StudentChatlist" element={<StudentRoute><RouteWrapper><StudentChatlist user={user}/></RouteWrapper></StudentRoute>}/>


      
      <Route path="/FacultyHome" element={<FacultyRoute><FacultyHome user={user}/></FacultyRoute>} />
      <Route path="/StudentDetails" element={<FacultyRoute><RouteWrapper><StudentDetails user={user} /></RouteWrapper></FacultyRoute> }/>
      <Route path="/FacultyChatroom/:id" element={<FacultyRoute><RouteWrapper><FacultyChatroom user={user}/></RouteWrapper></FacultyRoute>} />
      <Route path="/Facultychatlist" element={<FacultyRoute><RouteWrapper><FacultyChatlist user={user}/></RouteWrapper></FacultyRoute>}/>


      {/* Admin-Only Routes */}
      <Route path="/AdminHome" element={<AdminRoute><AdminHome user={user}/></AdminRoute>} />
      <Route path="/StudentApprove" element={<AdminRoute><StudentApprove user={user}/></AdminRoute>} />
      <Route path="/Adminpost" element={<AdminRoute><AdminPost user={user} /></AdminRoute>} />
    </Routes>
  );
};

export default App;
