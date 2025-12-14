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
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  LogOut,
  User,
} from "lucide-react";

export default function PendingReviews() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const reviews = [
    {
      id: 1,
      name: "Md. Mohiul Islam Miraz",
      studentId: "C231197",
      email: "miraz@student.iiuc.ac.bd",
      cgpa: "3.75",
      currentCredits: 95,
      requestedCredits: 7,
      totalCourses: 3,
      submittedDate: "Mar 3, 2025 10:30 AM",
      hasIssues: false,
      courses: [
        {
          code: "CSE-3642",
          name: "Software Engineering Lab",
          credits: 1,
          schedule: "Sun 10:00 AM - 12:00 PM",
          issues: [],
        },
        {
          code: "CSE-3641",
          name: "Software Engineering",
          credits: 3,
          schedule: "Mon, Wed 2:00 PM - 3:30 PM",
          issues: [],
        },
        {
          code: "CSE-3631",
          name: "Database Systems",
          credits: 3,
          schedule: "Tue, Thu 10:00 AM - 11:30 AM",
          issues: [],
        },
      ],
    },
    {
      id: 2,
      name: "Mohammad Moaz",
      studentId: "C231187",
      email: "moaz@student.iiuc.ac.bd",
      cgpa: "3.45",
      currentCredits: 88,
      requestedCredits: 6,
      totalCourses: 2,
      submittedDate: "Mar 3, 2025 7:15 AM",
      hasIssues: true,
      courses: [
        {
          code: "CSE-3651",
          name: "Computer Networks",
          credits: 3,
          schedule: "Sun, Tue 1:00 PM - 2:30 PM",
          issues: ["Prerequisites Not Met"],
        },
        {
          code: "CSE-3661",
          name: "Artificial Intelligence",
          credits: 3,
          schedule: "Mon, Wed 10:00 AM - 11:30 AM",
          issues: [],
          seatsInfo: "Only 3 seats left",
        },
      ],
    },
  ];

  const navigate = useNavigate();

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
                      <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
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
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  >
                    {/* <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg> */}
                    {/* <User className="w-5 h-5" /> */}
                    <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
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
              className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              <Clock className="w-5 h-5" />
              <span className="font-medium">Pending Reviews</span>
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
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span
                className="font-medium"
                onClick={() => navigate("/advisor/dashboard/approvedcourses")}
              >
                Approved Courses
              </span>
            </Link>
          </nav>
        </aside>

        {isSidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-opacity-50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="hidden lg:block w-64 flex-shrink-0"></div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Pending Reviews
            </h2>
            <p className="text-gray-600">
              Review and approve student course registrations
            </p>
          </div>

          {/* Summary Cards */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <div className="flex items-center space-x-8 ">
              <div className="lg:border-r-2 lg:border-gray-200 lg:pr-4 md:border-r-2 md:border-gray-200 md:pr-6">
                <p className="text-sm text-gray-600 mb-1">Total Pending</p>
                <p className="text-3xl font-bold text-gray-900">2</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">With Issues</p>
                <p className="text-3xl font-bold text-red-600">1</p>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`bg-white rounded-lg shadow border ${
                  review.hasIssues ? "border-red-400" : "border-gray-200"
                } p-6`}
              >
                {/* Student Header */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {review.name}
                      </h3>
                      {review.hasIssues && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center space-x-1 cursor-pointer">
                          <AlertCircle className="w-3 h-3" />
                          <span>Issues Found</span>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      ID: {review.studentId} • {review.email} • CGPA:{" "}
                      {review.cgpa}
                    </p>
                  </div>
                  <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-xs text-gray-500">Submitted</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {review.submittedDate}
                    </p>
                  </div>
                </div>

                {/* Credits Summary */}
                <div className="flex items-center space-x-6 mb-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Credits: </span>
                    <span className="font-bold text-gray-900">
                      {review.currentCredits}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Requested Credits: </span>
                    <span className="font-bold text-gray-900">
                      {review.requestedCredits}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total Courses: </span>
                    <span className="font-bold text-gray-900">
                      {review.totalCourses}
                    </span>
                  </div>
                </div>

                {/* Courses List ---> */}
                <div className="space-y-3 mb-4">
                  {review.courses.map((course, idx) => (
                    <div
                      key={idx}
                      className={`${
                        course.issues.length > 0
                          ? "bg-red-50 border-red-200"
                          : "bg-gray-50"
                      } rounded-lg p-4 border`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {course.code} - {course.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {course.schedule}
                          </p>
                        </div>
                        <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded border border-gray-200">
                          {course.credits} Credits
                        </span>
                      </div>

                      {course.issues.length > 0 && (
                        <div className="mt-2">
                          {course.issues.map((issue, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center space-x-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                            >
                              <AlertCircle className="w-3 h-3" />
                              <span>{issue}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {course.seatsInfo && (
                        <p className="text-sm text-gray-700 mt-2">
                          {course.seatsInfo}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 cursor-pointer">
                    <ThumbsUp className="w-4 h-4" />
                    <span>Approve All</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 cursor-pointer">
                    <ThumbsDown className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
