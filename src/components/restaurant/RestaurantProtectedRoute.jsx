import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ correct for Vite + ESM


const RestaurantProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("userType");
  const restaurantId = localStorage.getItem("restaurantId");
  let userId = null;

  if(token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token");
      return <Navigate to="/restaurant-login" />;
    }
  }

  const ismatch = restaurantId === userId;


  if (!token || user !== "restaurant" || !ismatch) {
    return <Navigate to="/restaurant-login" />;
  }

  return children;
};

export default RestaurantProtectedRoute;
