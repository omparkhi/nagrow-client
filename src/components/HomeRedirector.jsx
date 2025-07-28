import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomeRedirector = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");

    if (token && userType) {
      switch (userType) {
        case "user":
          navigate("/user-home");
          break;
        case "restaurant":
          navigate("/restaurant-home");
          break;
        // case "rider":
        //   navigate("/rider/dashboard");
        //   break;
        // case "admin":
        //   navigate("/admin/dashboard");
        //   break;
        default:
          navigate("/home");
      }
    } else {
      navigate("/home"); // Show 4-buttons page
    }
  }, []);

  return null; // or a loading spinner if you want
};

export default HomeRedirector;
