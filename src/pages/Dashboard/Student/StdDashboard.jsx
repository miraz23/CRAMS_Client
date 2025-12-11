import React, { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import Swal from "sweetalert2";
import caplogo from "../../../assets/CAP.png";
import { fetchRegistrationStatus, fetchSchedule } from "../../../api/studentApi";

export default function StdDashboard() {
  const navigate = useNavigate();
  const [regSummary, setRegSummary] = useState({});
  const [recentRegs, setRecentRegs] = useState([]);
  const [scheduleSummary, setScheduleSummary] = useState({});

  const loadData = async () => {
    try {
      const [statusData, scheduleData] = await Promise.all([
        fetchRegistrationStatus(),
        fetchSchedule(),
      ]);
      setRegSummary(statusData?.summary || {});
      setRecentRegs((statusData?.registrations || []).slice(0, 3));
      setScheduleSummary(scheduleData?.summary || {});
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load dashboard data.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(
    () => [
      {
        label: "Registered Courses",
        value: regSummary.total ?? 0,
        icon: BookOpen,
        color: "text-blue-600",
      },
      {
        label: "Pending Approval",
        value: regSummary.pending ?? 0,
        icon: Clock,
        color: "text-gray-600",
      },
      {
        label: "Total Credits",
        value: regSummary.totalCredits ?? 0,
        icon: TrendingUp,
        color: "text-green-600",
      },
      {
        label: "Approved",
        value: regSummary.approved ?? 0,
        icon: CheckCircle,
        color: "text-green-600",
      },
    ],
    [regSummary]
  );

  const deadlines = [
    {
      title: "Course Registration Deadline",
      date: "Check portal notice",
      days: scheduleSummary.daysWithClasses?.length
        ? `${scheduleSummary.daysWithClasses.length} active days`
        : "N/A",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4">
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-10 cursor-pointer"
          >
            <img src={caplogo} alt="" className="w-14 h-14" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CRAMS</h1>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white rounded-lg">
              <Grid className="w-5 h-5" />
              <span className="font-medium">Dashboard</span>
            </div>
            <button
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
              onClick={() => navigate("/student/dashboard/courseselection")}
            >
              <BookOpen className="w-5 h-5" />
              <span>Course Selection</span>
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
              onClick={() => navigate("/student/dashboard/myschedule")}
            >
              <Calendar className="w-5 h-5" />
              <span>My Schedule</span>
            </button>
            <button
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
              onClick={() => navigate("/student/dashboard/registrationstatus")}
            >
              <FileText className="w-5 h-5" />
              <span>Registration Status</span>
            </button>
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
                  <p className="text-sm font-medium text-gray-900">Student</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
                <button className="relative group p-2 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Overview synced from backend data.</p>
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
                    <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
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
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest course registration updates</p>
              </div>

              <div className="space-y-4">
                {recentRegs.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {reg.course?.courseCode} • {reg.course?.courseName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Status: {reg.status} • Semester: {reg.semester || "N/A"}
                      </p>
                    </div>
                    <div>
                      {reg.status === "approved" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          <CheckCircle className="w-4 h-4" />
                          approved
                        </span>
                      ) : reg.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                          <Clock className="w-4 h-4" />
                          {reg.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
                {recentRegs.length === 0 && (
                  <p className="text-gray-500">No recent activity.</p>
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Schedule Summary</h3>
                <p className="text-sm text-gray-500">Days with active classes</p>
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

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                onClick={() => navigate("/student/dashboard/courseselection")}
              >
                Browse Courses
              </button>
              <button
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/student/dashboard/myschedule")}
              >
                View Schedule
              </button>
              <button
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                onClick={() => navigate("/student/dashboard/registrationstatus")}
              >
                Check Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
