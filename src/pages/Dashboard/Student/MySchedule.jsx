import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import caplogo from "../../../assets/CAP.png";
import {
  BookOpen,
  Clock,
  Bell,
  LogOut,
  Grid,
  Calendar,
  FileText,
} from "lucide-react";
import { fetchSchedule } from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";

function MySchedule() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [schedule, setSchedule] = useState({ weeklySchedule: {}, summary: {}, courses: [] });
  const [loading, setLoading] = useState(false);

  const loadSchedule = async () => {
    setLoading(true);
    try {
      const data = await fetchSchedule();
      setSchedule(data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load schedule.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
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

  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center px-10 py-2 border-b border-gray-200 fixed left-0 w-full bg-white z-10">
        <div
          className="left-part flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={caplogo} alt="logo" className="w-14 h-14" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">CRAMS</h1>
            <p className="text-xs text-gray-500">Student</p>
          </div>
        </div>
        <div className="right-part flex items-center gap-4">
          <button className="relative p-2  text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5 cursor-pointer" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Student Portal</p>
            <p className="text-xs text-gray-500">My Schedule</p>
          </div>
          <button
            onClick={handleLogout}
            className="relative group p-2 flex items-center justify-center hover:bg-gray-50 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 bg-gray-50">
        <aside className="sidebar border-r border-gray-200 p-4 md:w-60 lg:w-64 left-0 fixed top-16 h-[calc(100vh-4rem)] bg-white">
          <nav className="space-y-1 ">
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard")}
            >
              <Grid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/courseselection")}
            >
              <BookOpen className="w-5 h-5" />
              <span> Course Selection</span>
            </button>
            <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg">
              <Calendar className="w-5 h-5" />
              <span>My Schedule</span>
            </div>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => {
                navigate("/student/dashboard/registrationstatus");
              }}
            >
              <FileText className="w-5 h-5" />
              <span>Registration Status</span>
            </button>
          </nav>
        </aside>
        <main className="ml-64 p-4 md:p-8 mt-16 flex flex-col gap-6 flex-1 overflow-y-auto bg-gray-50">
          <div>
            <p className="text-3xl font-bold mb-1">My Schedule</p>
            <p className="text-lg text-gray-500">Live schedule pulled from backend.</p>
          </div>
          <div className="border border-gray-300 p-6 rounded-lg bg-white ">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Weekly Schedule</p>
                <p className="text-gray-500">
                  View your class timings and locations for the week.
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Semester: {schedule.semester || "N/A"} | Total Credits:{" "}
                {schedule.summary?.totalCredits ?? 0}
              </p>
            </div>
            {loading && <p className="text-gray-500 mt-4">Loading schedule...</p>}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {Object.keys(schedule.weeklySchedule || {}).map((day) => (
                  <div key={day} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <p className="font-semibold text-gray-800">{day}</p>
                    </div>
                    <div className="space-y-3">
                      {(schedule.weeklySchedule[day] || []).map((cls, idx) => (
                        <div
                          key={`${cls.courseId}-${idx}`}
                          className="bg-blue-50 border border-blue-100 rounded-lg p-3"
                        >
                          <p className="font-bold text-gray-900">{cls.courseCode}</p>
                          <p className="text-sm text-gray-700">{cls.courseName}</p>
                          <p className="text-sm text-gray-600">
                            {cls.startTime} - {cls.endTime}
                          </p>
                          <p className="text-sm text-gray-600">{cls.instructor}</p>
                          <span className="text-xs uppercase tracking-wide text-gray-500">
                            {cls.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(schedule.weeklySchedule || {}).length === 0 && (
                  <p className="text-gray-500 col-span-full">No scheduled classes found.</p>
                )}
              </div>
            )}
          </div>

          <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-md">
            <div className="mb-5">
              <p className="text-3xl font-bold mb-1">Course Details</p>
              <p className="text-lg text-gray-500">Information about selected courses.</p>
            </div>
            <div className="space-y-4">
              {loading && <p className="text-gray-500">Loading courses...</p>}
              {!loading &&
                (schedule.courses || []).map((course) => (
                  <div key={course.id} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex gap-3 mb-2 items-center">
                      <h1 className="text-2xl font-bold">{course.courseCode}</h1>
                      <p className="border border-gray-400 px-2 py-1 rounded-lg text-sm font-semibold">
                        {course.courseName}
                      </p>
                      <span className="text-xs text-gray-600 uppercase">{course.status}</span>
                    </div>
                    <div className="text-gray-600">
                      <p>Instructor: {course.instructor || "TBA"}</p>
                      <p>
                        Days: {(course.schedule?.days || []).join(", ")}{" "}
                        {course.schedule?.startTime ? `• ${course.schedule.startTime}` : ""}{" "}
                        {course.schedule?.endTime ? `- ${course.schedule.endTime}` : ""}
                      </p>
                      <p>Semester: {course.semester || "N/A"}</p>
                      <p>Credits: {course.credits || 0}</p>
                    </div>
                  </div>
                ))}
              {!loading && (schedule.courses || []).length === 0 && (
                <p className="text-gray-500">No courses selected yet.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MySchedule;
