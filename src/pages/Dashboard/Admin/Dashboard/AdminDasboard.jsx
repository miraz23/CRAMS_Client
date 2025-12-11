import React from "react";
import { BiBookOpen, BiTrendingUp, BiUserCheck } from "react-icons/bi";
import { FaUserSecret } from "react-icons/fa";
import { FaCircleDot } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";

const AdminDashboard = () => {

  const stats = [
    {
      label: "Total Courses",
      value: "156",
      icon: BiBookOpen,
      color: "text-blue-600",
    },
    {
      label: "Active Students",
      value: "1,234",
      icon: FaUserSecret,
      color: "text-green-600",
    },
    {
      label: "Total Advisors",
      value: "28",
      icon: BiUserCheck,
      color: "text-purple-600",
    },
    {
      label: "Registrations",
      value: "892",
      icon: BiTrendingUp,
      color: "text-teal-600",
    },
  ];

  const recentActivity = [
    {
      type: "New course added",
      details: "CSE-4641 Machine Learning",
      time: "5 minutes ago",
    },
    {
      type: "User registered",
      details: "Student C231300",
      time: "12 minutes ago",
    },
    {
      type: "Course updated",
      details: "CSE-3631 seat capacity changed",
      time: "1 hour ago",
    },
    {
      type: "Advisor assigned",
      details: "Ahsanul Kalam Akib assigned to 15 students",
      time: "2 hours ago",
    },
  ];

  const systemAlerts = [
    {
      message: "CSE-3661 AI course has only 3 seats remaining",
      type: "info",
    },
    {
      message: "Registration deadline is in 5 days",
      type: "warning",
    },
    {
      message: "12 students pending advisor assignment",
      type: "error",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              System Dashboard
            </h2>
            <p className="text-gray-600">
              Monitor and manage the CRAMS platform
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-500 text-sm mb-2">{stat.label}</p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg bg-gray-50 ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-500">
                  Latest system events and changes
                </p>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        <FaCircleDot size={10} className="text-blue-600" />
                        {activity.type}
                      </h4>
                      <p className="text-sm text-gray-500">{activity.details}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                View All Activity
              </button>
            </div>

            {/* System Alerts */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  System Alerts
                </h3>
                <p className="text-sm text-gray-500">
                  Important notifications
                </p>
              </div>

              <div className="space-y-3">
                {systemAlerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`border rounded-lg p-3 flex items-start gap-3 ${
                      alert.type === "info"
                        ? "border-blue-200 bg-blue-50"
                        : alert.type === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-red-200 bg-red-50"
                    }`}
                  >
                    <FiAlertCircle
                      className={`mt-0.5 ${
                        alert.type === "info"
                          ? "text-blue-600"
                          : alert.type === "warning"
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                      size={18}
                    />
                    <span className="text-gray-700 text-sm">
                      {alert.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
