import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  MdNotifications,
  MdOutlineLogout,
  MdPerson,
  MdMenu,
  MdClose,
} from "react-icons/md";
import useUserRole from "../../hooks/useUserRole/useUserRole";
import useAuth from "../../hooks/useAuth/useAuth";
import toast, { Toaster } from "react-hot-toast";
import { TbLayoutDashboard } from "react-icons/tb";
import { IoBookOutline, IoSettingsOutline } from "react-icons/io5";
import { LuGraduationCap } from "react-icons/lu";
import { FiUsers } from "react-icons/fi";
import graduationcap from "../../assets/CAP.png";

const DashboardLayout = () => {
  const { user, logOut } = useAuth();
  const { role, isLoading } = useUserRole();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white font-semibold"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  const links = (
    <>
      <li>
        <NavLink to="profile" className={navLinkStyle}>
          <MdPerson className="inline mr-2" /> Profile
        </NavLink>
      </li>
    </>
  );

  const handleLogoutConfirm = async () => {
    try {
      await logOut();
      setShowModal(false);
      navigate("/");
      toast.success("Logged out successfully!", {
        duration: 2500,
        position: "top-center",
      });
    } catch (error) {
      setShowModal(false);
      toast.error("Logout failed. Try again.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      <Toaster />

      {/* Navbar */}
      <header className="w-full bg-white shadow-sm border-b flex justify-between items-center px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* icon for mobile */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <MdClose /> : <MdMenu />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-lg font-bold text-black"
          >
            <img src={graduationcap} height={40} width={40} alt="Logo" />
            <span className="ml-1 hidden sm:inline">CRAMS</span>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 sm:gap-4">
          <MdNotifications className="text-xl text-gray-600 cursor-pointer hover:text-blue-600" />

          <div className="hidden sm:block text-right">
            <p className="font-semibold text-gray-700 text-sm">
              {user?.displayName || "Admin User"}
            </p>
            <p className="text-xs text-gray-500">
              {role || "System Administrator"}
            </p>
          </div>

          {/* Logout Icon */}
          <MdOutlineLogout
            onClick={() => setShowModal(true)}
            className="text-2xl text-gray-600 cursor-pointer hover:text-red-600 transition"
            title="Logout"
          />
        </div>
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed md:static top-0 left-0 z-40 w-64 bg-white border-r border-gray-200 shadow-md transform transition-transform duration-300 h-full md:h-auto p-4
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className="flex justify-between items-center md:hidden mb-4">
            <h2 className="text-lg font-semibold text-gray-700">CRAMS</h2>
            <MdClose
              className="text-2xl cursor-pointer text-gray-600"
              onClick={() => setSidebarOpen(false)}
            />
          </div>

          {!isLoading && role?.toLowerCase() === "admin" ? (
            <ul className="space-y-2 mt-4">
              {links}
              <li>
                <NavLink to={""} end className={navLinkStyle}>
                  <TbLayoutDashboard size={20} /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/dashboard/course-management"
                  className={navLinkStyle}
                >
                  <IoBookOutline size={20} /> Course Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/dashboard/section-management"
                  className={navLinkStyle}
                >
                  <LuGraduationCap size={20} /> Section Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/dashboard/user-management"
                  className={navLinkStyle}
                >
                  <FiUsers size={20} /> User Management
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/admin/dashboard/system-settings"
                  className={navLinkStyle}
                >
                  <IoSettingsOutline size={20} /> System Settings
                </NavLink>
              </li>
            </ul>
          ) : (
            <p className="text-center text-gray-500 mt-10">Loading menu...</p>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto mt-14 md:mt-0">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">
              Are you sure you want to log out?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}
                className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
