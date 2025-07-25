import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("nagrow_token");
  if (!token) {
    return <Navigate to="/user-login" />;
  }
  return children;
};

export default ProtectedRoute;
