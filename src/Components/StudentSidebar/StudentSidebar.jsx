import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Grid, List, BookOpen, FileText, Calendar, User, Bell, LogOut, Home } from "lucide-react";
import caplogo from "../../assets/CAP.png";

const StudentSidebar = ({
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    {
      label: "Dashboard",
      icon: Grid,
      path: "/student/dashboard",
    },
    {
      label: "Routine",
      icon: List,
      path: "/student/dashboard/routine",
    },
    {
      label: "Course Selection",
      icon: BookOpen,
      path: "/student/dashboard/courseselection",
    },
    {
      label: "Registration Status",
      icon: FileText,
      path: "/student/dashboard/registrationstatus",
    },
    {
      label: "My Schedule",
      icon: Calendar,
      path: "/student/dashboard/myschedule",
    },
    {
      label: "Contact Advisor",
      icon: User,
      path: "/student/dashboard/contact-advisor",
    },
  ];

  const bottomActions = [
    {
      key: "home",
      icon: Home,
      title: "Home",
      onClick: () => navigate("/"),
    },
    {
      key: "notifications",
      icon: Bell,
      title: "Notifications",
      onClick: () => navigate("/student/dashboard/notifications"),
    },
    {
      key: "logout",
      icon: LogOut,
      title: "Logout",
      onClick: () => {
        if (onLogout) {
          onLogout();
        } else {
          navigate("/login");
        }
      },
    },
  ];

  return (
    <div className="w-64 bg-white shadow-sm flex flex-col h-full">
      <div className="p-4 flex flex-col justify-between h-full">
        <div>
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-10 cursor-pointer"
          >
            <div>
              <img src={caplogo} alt="" className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CRAMS</h1>
              <p className="text-xs text-gray-500">Student Dashboard</p>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.path}
                  href=""
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.onClick) {
                      item.onClick();
                    } else if (item.path) {
                      navigate(item.path);
                    }
                  }}
                >
                  {Icon && <Icon className="w-5 h-5" />}
                  <span className="font-medium">{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>

        <div className="mt-8 flex items-center justify-between px-4">
          {bottomActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.key}
                type="button"
                title={action.title}
                onClick={action.onClick}
                className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                {Icon && <Icon className="w-5 h-5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
