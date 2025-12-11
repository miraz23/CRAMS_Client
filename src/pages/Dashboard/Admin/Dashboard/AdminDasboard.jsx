import React, { useEffect, useState } from "react";
import { BiBookOpen, BiTrendingUp, BiUserCheck } from "react-icons/bi";
import { FaUserSecret } from "react-icons/fa";
import { FaCircleDot } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";

const AdminDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      label: "Total Courses",
      value: "0",
      icon: BiBookOpen,
      color: "text-blue-600",
    },
    {
      label: "Total Students",
      value: "0",
      icon: FaUserSecret,
      color: "text-green-600",
    },
    {
      label: "Total Teachers",
      value: "0",
      icon: BiUserCheck,
      color: "text-purple-600",
    },
    {
      label: "Total Sections",
      value: "0",
      icon: BiTrendingUp,
      color: "text-teal-600",
    },
  ]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemAlerts, setSystemAlerts] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch courses, user management overview, and sections in parallel
      const [coursesRes, userOverviewRes, sectionsRes] = await Promise.all([
        axiosSecure.get('/admin/courses'),
        axiosSecure.get('/admin/user-management/overview'),
        axiosSecure.get('/admin/sections'),
      ]);

      const courses = coursesRes.data.data || [];
      const userOverview = userOverviewRes.data.data || {};
      const sections = sectionsRes.data.data || [];

      // Update stats
      setStats([
        {
          label: "Total Courses",
          value: coursesRes.data.statistics?.totalCourses || courses.length,
          icon: BiBookOpen,
          color: "text-blue-600",
        },
        {
          label: "Total Students",
          value: userOverview.totals?.totalStudents || 0,
          icon: FaUserSecret,
          color: "text-green-600",
        },
        {
          label: "Total Teachers",
          value: userOverview.totals?.totalTeachers || 0,
          icon: BiUserCheck,
          color: "text-purple-600",
        },
        {
          label: "Total Sections",
          value: sectionsRes.data.statistics?.totalSections || sections.length,
          icon: BiTrendingUp,
          color: "text-teal-600",
        },
      ]);

      // Generate recent activity from courses (last 4 courses)
      const recentCourses = courses.slice(0, 4).map((course, index) => ({
        type: index === 0 ? "New course added" : "Course available",
        details: `${course.courseCode} ${course.courseName}`,
        time: "Recently",
      }));
      setRecentActivity(recentCourses);

      // Generate system alerts based on course availability
      const alerts = [];
      courses.forEach((course) => {
        const availableSeats = course.availableSeats || 0;
        if (availableSeats > 0 && availableSeats <= 5) {
          alerts.push({
            message: `${course.courseCode} has only ${availableSeats} seats remaining`,
            type: "info",
          });
        }
      });
      setSystemAlerts(alerts.slice(0, 3));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

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
