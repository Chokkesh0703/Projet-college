import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user && user.role === "faculty" ? children : <Navigate to="/" />;
};

export default AdminRoute;
