import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ correct for Vite + ESM

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const adminIdFromStorage = localStorage.getItem("adminId");
  let adminId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      adminId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token");
      return <Navigate to="/admin-login" />;
    }
  }

  const isMatch = adminIdFromStorage === adminId;

  if (!token || userType !== "admin" || !isMatch) {
    return <Navigate to="/admin-login" />;
  }

  return children;
};

export default AdminProtectedRoute;
