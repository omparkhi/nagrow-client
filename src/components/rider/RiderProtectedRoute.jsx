import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 

const RiderProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const riderIdFromStorage = localStorage.getItem("riderId");

  let riderId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      riderId = decoded.id || decoded._id;

    } catch (err) {
      console.error("Invalid token");
      return <Navigate to="/rider-login" />;
    }
  }

  const isMatch = riderId === riderIdFromStorage;

  if (!token || userType !== "rider" || !isMatch) {
    return <Navigate to="/rider-login" />;
  }

  return children;
};

export default RiderProtectedRoute;
