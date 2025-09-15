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
import UserDash from "./components/user/userDash/UserDash";
import ProtectedRoute from "./components/user/ProtectedRoute";
import RestaurantSignUp from "./components/restaurant/RestaurantSignUp";
import RestaurantLogin from "./components/restaurant/RestaurantLogin";
import RestaurantDash from "./components/restaurant/RestaurantDash";
import HomeRedirector from "./components/HomeRedirector";
import UserRoleOptions from "./components/user/UserRoleOptions";
import RiderSignUp from "./components/rider/RiderSignUp";
import RiderLogin from "./components/rider/RiderLogin";
import RiderDash from "./components/rider/RiderDash";

import RestaurantProtectedRoute from "./components/restaurant/RestaurantProtectedRoute";
import DocumentVerification from "./components/restaurant/DocumentVerification";
import RiderProtectedRoute from "./components/rider/RiderProtectedRoute";

import AdminSignup from "./components/admin/AdminSigup";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDash from "./components/admin/AdminDash";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

import AddressCard from "./components/user/userAddress/AddressCard";
import MapModalPage from "./components/user/userAddress/MapModalPage";
import CurrentLocationMapModal from "./components/user/userAddress/CurrentLocationMapModal";

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
        <Route path="/restaurant-signup" element={<RestaurantSignUp />} />
        <Route path="/restaurant-login" element={<RestaurantLogin />} />
        <Route path="/rider-signup" element={<RiderSignUp />} />
        <Route path="/rider-login" element={<RiderLogin />} />
        <Route path="/restaurant-verify" element={<DocumentVerification />} />
        <Route path="/admin-signup" element={<AdminSignup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/address-page" element={<AddressCard />} />
        <Route path="/map" element={<MapModalPage />} />
        <Route
          path="/map/current-location"
          element={<CurrentLocationMapModal />}
        />

        <Route
          path="/admin-home"
          element={
            <AdminProtectedRoute>
              <AdminDash />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/rider-home"
          element={
            <RiderProtectedRoute>
              <RiderDash />
            </RiderProtectedRoute>
          }
        />

        <Route
          path="/restaurant-home"
          element={
            <RestaurantProtectedRoute>
              <RestaurantDash />
            </RestaurantProtectedRoute>
          }
        />

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
