import React from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle,
  Bell,
  LogOut,
  Grid,
  Calendar,
  FileText,
  Menu,
  GraduationCap,
} from "lucide-react";
import caplogo from "../../../assets/CAP.png";

export default function StdDashboard() {
  const stats = [
    {
      label: "Registered Courses",
      value: "4",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      label: "Pending Approval",
      value: "2",
      icon: Clock,
      color: "text-gray-600",
    },
    {
      label: "Total Credits",
      value: "12",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      label: "Completed",
      value: "2",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  const recentActivity = [
    {
      course: "CSE-3642 Software Engineering Lab",
      advisor: "Dr. Akib",
      time: "2 hours ago",
      status: "approved",
    },
    {
      course: "CSE-3641 Software Engineering",
      advisor: "Dr. Akib",
      time: "3 hours ago",
      status: "approved",
    },
    {
      course: "CSE-3631 Database Systems",
      advisor: "Dr. Rahman",
      time: "1 day ago",
      status: "pending",
    },
  ];

  const deadlines = [
    {
      title: "Course Registration Deadline",
      date: "March 15, 2025",
      days: "5d",
    },
    { title: "Add/Drop Period Ends", date: "March 20, 2025", days: "10d" },
    { title: "Advisor Meeting", date: "March 10, 2025", days: "2d" },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-10 cursor-pointer"
          >
            <div>
              {/* <BookOpen className="w-6 h-6 text-white" /> */}
              {/* <GraduationCap className="w-10 h-10 text-blue-600" /> */}
              <img src={caplogo} alt="" className="w-14 h-14" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">CRAMS</h1>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>

          <nav className="space-y-1">
            <a
              href=""
              className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </a>
            <a
              href=""
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <BookOpen className="w-5 h-5" />
              <span
                onClick={() => navigate("/student/dashboard/courseselection")}
              >
                Course Selection
              </span>
            </a>
            <a
              href=""
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Calendar className="w-5 h-5" />
              <span onClick={() => navigate("/student/dashboard/myschedule")}>
                My Schedule
              </span>
            </a>
            <a
              href=""
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <FileText className="w-5 h-5" />
              <span
                onClick={() =>
                  navigate("/student/dashboard/registrationstatus")
                }
              >
                Registration Status
              </span>
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-gray-600 lg:hidden" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Md. Mohiul Islam Miraz
                  </p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
                {/* <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" /> */}
                <button className="relative group p-2 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
                  <span
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-1 
                               bg-gray-800 text-white text-sm font-semibold py-1 px-2 rounded 
                               opacity-0 group-hover:opacity-100 
                               transition-opacity duration-200 whitespace-nowrap"
                  >
                    Logout
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, Mohiul
            </h2>
            <p className="text-gray-600">
              Here's your academic overview for Spring 2025
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
                  Your latest course registration updates
                </p>
              </div>

              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {activity.course}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Advisor: {activity.advisor} • {activity.time}
                      </p>
                    </div>
                    <div>
                      {activity.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          pending
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium">
                View All Activity
              </button>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  Upcoming Deadlines
                </h3>
                <p className="text-sm text-gray-500">
                  Important dates to remember
                </p>
              </div>

              <div className="space-y-4">
                {deadlines.map((deadline, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {deadline.title}
                      </h4>
                      <span className="text-xs font-bold text-gray-900">
                        {deadline.days}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{deadline.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Progress */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                Registration Progress
              </h3>
              <p className="text-sm text-gray-500">
                Track your course registration for Spring 2025
              </p>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-900">
                  12 of 15 credits registered
                </span>
                <span className="text-sm font-bold text-gray-900">80%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: "80%" }}
                ></div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>You need 3 more credits to reach full-time status</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Browse Courses
              </button>
              <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                View Schedule
              </button>
              <button className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Check Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
