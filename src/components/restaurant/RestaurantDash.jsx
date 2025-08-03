import React, { useState } from "react";
import {
  Home,
  List,
  ClipboardList,
  BarChart2,
  Image,
  Settings,
  LogOut,
  Search,
  PlusCircle,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleLogOut = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/restaurant-login");
    }, 1500);
  };

  return (
    <div
      className={`fixed sm:static z-40 top-0 left-0 sm:h-screen h-full w-64 bg-gray-900 text-white p-4 space-y-6 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } sm:translate-x-0`}
    >
      <div className="flex items-center justify-between text-2xl font-bold mb-8">
        NaGrow
        <button className="sm:hidden" onClick={toggleSidebar}>
          ✕
        </button>
      </div>

      <nav className="space-y-4">
        <SidebarItem icon={<Home size={20} />} label="Dashboard" onClick={() => navigate("/restaurant-home")} />
        <SidebarItem icon={<List size={20} />} label="Menu Items" />
        <SidebarItem icon={<ClipboardList size={20} />} label="Orders" />
        <SidebarItem icon={<BarChart2 size={20} />} label="Analytics" />
        <SidebarItem icon={<Image size={20} />} label="Media" />
        <SidebarItem icon={<ClipboardList size={20} />} label="Verification" onClick={() => navigate("/restaurant-verify")} />
        <SidebarItem icon={<Settings size={20} />} label="Settings" />
        <SidebarItem icon={<LogOut size={20} />} label="Logout" onClick={handleLogOut} />
      </nav>
    </div>
  );
};

const SidebarItem = ({ icon, label, onClick }) => (
  <div
    className="flex items-center space-x-3 hover:bg-gray-800 p-2 rounded cursor-pointer"
    onClick={onClick}
  >
    {icon}
    <span className="text-sm sm:text-base">{label}</span>
  </div>
);

const MainContent = ({ toggleSidebar }) => {
  return (
    <div className="flex-1 p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button className="sm:hidden" onClick={toggleSidebar}>
            <Menu size={24} />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold">Restaurant Dashboard</h1>
        </div>
        <div className="flex items-center bg-white rounded shadow px-4 py-2 w-full ml-4 sm:w-64">
          <Search className="text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none bg-transparent w-full"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded shadow">🍔 Food Item Card</div>
        <div className="bg-white p-4 rounded shadow">📋 Order List</div>
        <div className="bg-white p-4 rounded shadow">📊 Sales Chart</div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Add New Menu Item</h2>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            <PlusCircle size={18} /> Add Item
          </button>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Active Orders</h2>
          <ul className="list-disc ml-4 text-sm text-gray-600">
            <li>Order #1023 - Preparing</li>
            <li>Order #1024 - Out for Delivery</li>
          </ul>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Restaurant Info</h2>
          <p className="text-sm text-gray-600">
            ABC Restaurant, Street 4, City
            <br />
            Open: 10 AM - 11 PM
          </p>
        </div>
      </div>
    </div>
  );
};

const RestaurantDash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="flex flex-col sm:flex-row">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <MainContent toggleSidebar={toggleSidebar} />
    </div>
  );
};

export default RestaurantDash;
