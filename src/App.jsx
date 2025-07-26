import "./App.css";
import Home from "./components/Home";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Verification from "./components/user/Verification";
import UserLogin from "./components/user/UserLogin";
import UserSignup from "./components/user/UserSignup";
import Loader from "./components/Loader";
import SaveLocation from "./components/user/UserSaveLocation";
import UserDash from "./components/user/UserDash";
import ProtectedRoute from "./components/user/ProtectedRoute";
import HomeRedirector from "./components/HomeRedirector";
import UserRoleOptions from "../../nagrow-client-test/src/components/user/UserRoleOptions";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<HomeRedirector />} />
        <Route path="/customer-options" element={<UserRoleOptions />} />
        <Route path="/home" element={<Home />} />
        <Route path="/user-verification" element={<Verification />} />
        <Route path="/user-signup" element={<UserSignup />} />
        <Route path="/user-login" element={<UserLogin />} />
        <Route path="/save-address" element={<SaveLocation />} />
        <Route
          path="/user-home"
          element={
            <ProtectedRoute>
              <UserDash />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
