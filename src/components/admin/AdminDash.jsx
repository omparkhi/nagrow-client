import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
} from "lucide-react";
import { toast } from "react-toastify";

const AdminDash = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear admin data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    localStorage.removeItem("adminId");
    toast.success("logout succesfully")
    navigate("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-xl font-bold mb-8 text-blue-600">Admin Panel</h2>
        <nav className="flex flex-col space-y-4">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            to="/admin/users"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <Users size={20} /> Manage Users
          </Link>
          <Link
            to="/admin/restaurants"
            className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
          >
            <FileText size={20} /> Restaurant Docs
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 mt-4 hover:text-red-700"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Welcome, Admin</h1>
          <p className="text-gray-500 text-sm">
            Manage restaurants, riders, and users.
          </p>
        </div>

        {/* Outlet for nested routes */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDash;
