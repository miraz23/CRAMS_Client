import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, BookOpen, Users, Settings } from "lucide-react";
import caplogo from "../../assets/CAP.png";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white shadow-sm">
      <div className="p-4">
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-10 cursor-pointer"
        >
          <div>
            <img src={caplogo} alt="" className="w-14 h-14" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">CRAMS</h1>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>

        <nav className="space-y-1">
          <a
            href=""
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive("/admin/dashboard")
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/dashboard");
            }}
          >
            <Grid className="w-5 h-5" />
            <span className="font-medium">Dashboard</span>
          </a>
          <a
            href=""
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive("/admin/dashboard/coursemanagement")
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/dashboard/coursemanagement");
            }}
          >
            <BookOpen className="w-5 h-5" />
            <span>Course Management</span>
          </a>
          <a
            href=""
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive("/admin/dashboard/sectionmanagement")
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/dashboard/sectionmanagement");
            }}
          >
            <Users className="w-5 h-5" />
            <span>Section Management</span>
          </a>
          <a
            href=""
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive("/admin/dashboard/usermanagement")
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/dashboard/usermanagement");
            }}
          >
            <Users className="w-5 h-5" />
            <span>User Management</span>
          </a>
          <a
            href=""
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
              isActive("/admin/dashboard/systemsettings")
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:bg-gray-50"
            }`}
            onClick={(e) => {
              e.preventDefault();
              navigate("/admin/dashboard/systemsettings");
            }}
          >
            <Settings className="w-5 h-5" />
            <span>System Settings</span>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;

