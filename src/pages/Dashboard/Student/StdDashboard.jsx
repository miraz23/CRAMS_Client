import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import StudentSidebar from "../../../Components/StudentSidebar/StudentSidebar";
import Swal from "sweetalert2";
import { fetchRegistrationStatus, fetchSchedule, getSystemSettings } from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";

export default function StdDashboard() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [regSummary, setRegSummary] = useState({});
  const [recentRegs, setRecentRegs] = useState([]);
  const [scheduleSummary, setScheduleSummary] = useState({});
  const [systemSettings, setSystemSettings] = useState({});

  const loadData = async () => {
    try {
      const [statusData, scheduleData, settingsData] = await Promise.all([
        fetchRegistrationStatus(),
        fetchSchedule(),
        getSystemSettings(),
      ]);
      setRegSummary(statusData?.summary || {});
      setRecentRegs((statusData?.registrations || []).slice(0, 3));
      setScheduleSummary(scheduleData?.summary || {});
      setSystemSettings(settingsData || {});
    } catch (error) {
      const message = error.response?.data?.message || "Unable to load dashboard data.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

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

  // Format registration deadline
  const formatDeadline = () => {
    const regPeriod = systemSettings?.registrationPeriod;
    if (!regPeriod || !regPeriod.enabled) {
      return "Not Available";
    }
    if (regPeriod.endDate) {
      const endDate = new Date(regPeriod.endDate);
      return endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    }
    return "Check portal notice";
  };

  // Format days with classes
  const formatActiveDays = () => {
    const days = scheduleSummary.daysWithClasses;
    if (!days || days.length === 0) {
      return "N/A";
    }
    return days.join(", ");
  };

  const deadlines = [
    {
      title: "Course Registration Deadline",
      date: formatDeadline(),
      info: systemSettings?.registrationPeriod?.enabled 
        ? "Registration is open" 
        : "Registration is currently closed",
    },
    {
      title: "Active Class Days",
      date: formatActiveDays(),
      info: scheduleSummary.daysWithClasses?.length 
        ? `${scheduleSummary.daysWithClasses.length} days per week`
        : "No classes scheduled",
    },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Here's your registration overview for Spring 2026</p>
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
                    <h4 className="font-semibold text-gray-900 text-sm mb-2">
                      {deadline.title}
                    </h4>
                    <p className="text-base font-bold text-blue-600 mb-1">
                      {deadline.date}
                    </p>
                    <p className="text-xs text-gray-500">{deadline.info}</p>
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
