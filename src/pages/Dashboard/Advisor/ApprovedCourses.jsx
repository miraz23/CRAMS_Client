import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Bell,
  Menu,
  X,
  LayoutDashboard,
  Clock,
  Users,
  CheckCircle,
  Download,
  LogOut,
  User,
} from "lucide-react";

export default function ApprovedCourses() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const approvedCourses = [
    {
      id: 1,
      code: "CSE-3641",
      name: "Software Engineering",
      credits: 3,
      student: "Md. Mohiul Islam Miraz (C231197)",
      approvedDate: "Mar 1, 2025",
      feedback: "Approved. Good luck!",
    },
    {
      id: 2,
      code: "CSE-3642",
      name: "Software Engineering Lab",
      credits: 1,
      student: "MD. Ashfaqur Rashid (C231261)",
      approvedDate: "Mar 1, 2025",
      feedback: "Approved.",
    },
    {
      id: 3,
      code: "CSE-3631",
      name: "Database Systems",
      credits: 3,
      student: "S.M. Asfaqur Rahman (C231272)",
      approvedDate: "Feb 28, 2025",
      feedback: "Approved. Make sure to attend all labs.",
    },
    {
      id: 4,
      code: "CSE-3661",
      name: "Artificial Intelligence",
      credits: 3,
      student: "Junaid Mahmud (C231189)",
      approvedDate: "Feb 28, 2025",
      feedback: "Approved.",
    },
  ];

  const totalApproved = approvedCourses.length;
  const thisWeek = 8;
  const totalCredits = approvedCourses.reduce(
    (sum, course) => sum + course.credits,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>

              <div className="flex items-center space-x-2 lg:pl-6 cursor-pointer">
                <GraduationCap
                  className="w-8 h-8 text-blue-600"
                  strokeWidth={2}
                />
                <div className="flex flex-col">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    CRAMS
                  </h1>
                  <p className="text-xs text-gray-500 hidden sm:block">
                    Academic Advisor
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="lg:hidden relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                >
                  <User className="w-5 h-5 cursor-pointer" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">
                        Dr. Ahasanul Kalam Akib
                      </p>
                      <p className="text-xs text-gray-500">Academic Advisor</p>
                    </div>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2">
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="hidden lg:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    Dr. Ahasanul Kalam Akib
                  </p>
                  <p className="text-xs text-gray-500">Academic Advisor</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-20 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {/* <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-900">
                          Dr. Ahasanul Kalam Akib
                        </p>
                        <p className="text-xs text-gray-500">
                          Academic Advisor
                        </p>
                      </div> */}
                      <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer">
                        {/* <LogOut className="w-4 h-4" /> */}
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed top-16 bottom-0 left-0 z-20 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out overflow-y-auto`}
        >
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <nav className="p-4 space-y-2">
            <Link
              to="/advisor/dashboard"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span
                className="font-medium"
                onClick={() => navigate("/advisor/dashboard")}
              >
                Dashboard
              </span>
            </Link>
            <Link
              to="/advisor/dashboard/pendingreviews"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Clock className="w-5 h-5" />
              <span
                className="font-medium"
                onClick={() => navigate("/advisor/dashboard/pendingreviews")}
              >
                Pending Reviews
              </span>
            </Link>
            <Link
              to="/advisor/dashboard/mystudents"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span
                className="font-medium"
                onClick={() => navigate("/advisor/dashboard/mystudents")}
              >
                My Students
              </span>
            </Link>
            <Link
              to="/advisor/dashboard/approvedcourses"
              className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Approved Courses</span>
            </Link>
          </nav>
        </aside>

        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0  bg-opacity-50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="hidden lg:block w-64 flex-shrink-0"></div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Approved Courses
              </h2>
              <p className="text-gray-600">
                View your recently approved course registrations
              </p>
            </div>
            <button className=" flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer">
              <Download className="w-4 h-4" />
              <span>Export Report</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
            <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-6">
              <div className="lg:border-r-2 lg:border-gray-200 md:border-r-2 md:border-gray-200">
                <p className="text-sm text-gray-600 mb-1">Total Approved</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalApproved}
                </p>
              </div>
              <div className="lg:border-r-2 lg:border-gray-200 md:border-r-2 md:border-gray-200">
                <p className="text-sm text-gray-600 mb-1">This Week</p>
                <p className="text-3xl font-bold text-teal-600">{thisWeek}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Credits</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalCredits}
                </p>
              </div>
            </div>
          </div>

          {/* Recent Approvals */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Recent Approvals
              </h3>
              <p className="text-sm text-gray-600">
                Course registrations you've approved
              </p>
            </div>

            <div className="space-y-6">
              {approvedCourses.map((course) => (
                <div
                  key={course.id}
                  className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0"
                >
                  {/* Course Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-gray-900">
                          {course.code}
                        </h4>
                        <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                          {course.credits} Credits
                        </span>
                        <span className="flex items-center space-x-1 bg-teal-600 text-white text-xs px-2 py-1 rounded">
                          <CheckCircle className="w-3 h-3" />
                          <span>Approved</span>
                        </span>
                      </div>
                      <p className="text-base font-medium text-gray-900 mb-2">
                        {course.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Student: {course.student}
                      </p>
                      <p className="text-sm text-gray-600">
                        Approved: {course.approvedDate}
                      </p>
                    </div>
                  </div>

                  {/* Feedback Section */}
                  <div className="bg-gray-200 rounded-lg p-4 mt-3">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Your Feedback:
                    </p>
                    <p className="text-sm text-gray-700">{course.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
