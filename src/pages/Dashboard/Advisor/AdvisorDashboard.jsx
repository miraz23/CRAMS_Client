import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Users,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import AdvisorSidebar from "../../../Components/AdvisorSidebar/AdvisorSidebar";
import useAuth from "../../../hooks/useAuth/useAuth";
import { getAdvisorDashboard } from "../../../api/teacherApi";
import Swal from "sweetalert2";
 
export default function AdvisorDashboard() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    {
      label: "Pending Reviews",
      value: "0",
      icon: Clock,
      color: "text-gray-600",
    },
    {
      label: "Approved Today",
      value: "0",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Total Students",
      value: "0",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Avg Response Time",
      value: "0h",
      icon: TrendingUp,
      color: "text-teal-600",
    },
  ]);
  const [urgentReviews, setUrgentReviews] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
 
  useEffect(() => {
    fetchDashboardData();
  }, []);
 
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const data = await getAdvisorDashboard();
 
      const summary = data.summary || {};
      setStats([
        {
          label: "Pending Reviews",
          value: String(summary.pendingReviews || 0),
          icon: Clock,
          color: "text-gray-600",
        },
        {
          label: "Approved Today",
          value: String(summary.approvedToday || 0),
          icon: CheckCircle,
          color: "text-green-600",
        },
        {
          label: "Total Students",
          value: String(summary.totalStudents || 0),
          icon: Users,
          color: "text-blue-600",
    },
    {
          label: "Avg Response Time",
          value: summary.avgResponseTimeHours 
            ? `${summary.avgResponseTimeHours}h` 
            : "0h",
          icon: TrendingUp,
          color: "text-teal-600",
        },
      ]);
 
      const formattedUrgentReviews = (data.urgentReviews || []).map((review) => {
        const submittedDate = review.submittedAt ? new Date(review.submittedAt) : new Date();
        const now = new Date();
        const hoursAgo = Math.floor((now - submittedDate) / (1000 * 60 * 60));
        const submitted = hoursAgo < 1 ? "Just now" : `${hoursAgo}h ago`;
 
        return {
          name: review.studentName || "Unknown Student",
          id: review.studentId || "",
          courses: `${review.courseCount || 0} courses • ${review.totalCredits || 0} credits`,
          submitted: submitted,
          hasIssue: false, // You can add issue detection logic if needed
          studentMongoId: review.studentMongoId,
        };
      });
      setUrgentReviews(formattedUrgentReviews);
 
      const formattedActivity = (data.recentActivity || []).map((activity) => {
        const actedDate = activity.actedAt ? new Date(activity.actedAt) : new Date();
        const now = new Date();
        const minutesAgo = Math.floor((now - actedDate) / (1000 * 60));
        const hoursAgo = Math.floor((now - actedDate) / (1000 * 60 * 60));
        let time = "";
        if (minutesAgo < 1) {
          time = "Just now";
        } else if (minutesAgo < 60) {
          time = `${minutesAgo} minute${minutesAgo !== 1 ? "s" : ""} ago`;
        } else if (hoursAgo < 24) {
          time = `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
        } else {
          const daysAgo = Math.floor(hoursAgo / 24);
          time = `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
        }
 
        return {
          status: activity.status === "approved" ? "Approved" : "Rejected",
          course: activity.courseCode || "",
          student: activity.studentName || "Unknown Student",
          time: time,
          color: activity.status === "approved" ? "bg-green-500" : "bg-red-500",
        };
      });
      setRecentActivity(formattedActivity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };
 
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };
 
  return (
    <div className="flex h-screen bg-gray-50">
      <AdvisorSidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Here's your advising overview for Spring 2026
            </p>
          </div>
 
          {/* Stats Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200 animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </div>
              );
            })}
          </div>
          )}
 
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Urgent Reviews */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Urgent Reviews
                </h3>
                <p className="text-sm text-gray-600">
                  Students waiting for course approval
                </p>
              </div>
 
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading...</p>
                  </div>
                ) : urgentReviews.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No pending reviews at the moment</p>
                  </div>
                ) : (
                  urgentReviews.map((review, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-semibold text-gray-900">
                          {review.name}
                        </h4>
                        {review.hasIssue && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            Issues
                          </span>
                        )}
                      </div>
                      <button 
                        onClick={() => navigate("/advisor/dashboard/pendingreviews")}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                      >
                        Review
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      ID: {review.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      {review.courses} • Submitted {review.submitted}
                    </p>
                  </div>
                  ))
                )}
              </div>
 
              <button 
                onClick={() => navigate("/advisor/dashboard/pendingreviews")}
                className="w-full mt-4 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50"
              >
                View All Pending Reviews
              </button>
            </div>
 
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  Recent Activity
                </h3>
                <p className="text-sm text-gray-600">Your latest actions</p>
              </div>
 
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    <p>No recent activity</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div
                      className={`w-2 h-2 ${activity.color} rounded-full mt-1.5`}
                    ></div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">
                        {activity.status} {activity.course}
                      </p>
                      <p className="text-xs text-gray-600">
                        {activity.student}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  ))
                )}
              </div>
            </div>
          </div>
 
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button 
                onClick={() => navigate("/advisor/dashboard/pendingreviews")}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700"
              >
                Review Pending
              </button>
              <button 
                onClick={() => navigate("/advisor/dashboard/mystudents")}
                className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50"
              >
                View Students
              </button>
              <button 
                onClick={() => navigate("/advisor/dashboard/approvedcourses")}
                className="bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50"
              >
                View Approved
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
