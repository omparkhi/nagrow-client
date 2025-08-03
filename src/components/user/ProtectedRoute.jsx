import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const userIdFromStorage = localStorage.getItem("userId");

  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;

    } catch (err) {
      console.error("Invalid token");
      return <Navigate to="/user-login" />;
    }
  }

  const isMatch = userId === userIdFromStorage;

  if (!token || userType !== "user" || !isMatch) {
    return <Navigate to="/user-login" />;
  }

  return children;
};

export default ProtectedRoute;
