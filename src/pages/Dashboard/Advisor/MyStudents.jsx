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
  Search,
  Mail,
  Phone,
  LogOut,
  User,
} from "lucide-react";

export default function MyStudents() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const students = [
    {
      id: 1,
      name: "Md. Mohiul Islam Miraz",
      studentId: "C231197",
      cgpa: "3.75",
      credits: 95,
      semester: "7th",
      status: "Active",
      email: "miraz@student.iiuc.ac.bd",
      phone: "+880 1234-567890",
      pendingReviews: 3,
    },
    {
      id: 2,
      name: "Mohammad Moaz",
      studentId: "C231187",
      cgpa: "3.45",
      credits: 88,
      semester: "7th",
      status: "Active",
      email: "moaz@student.iiuc.ac.bd",
      phone: "+880 1234-567891",
      pendingReviews: 2,
    },
    {
      id: 3,
      name: "Junaid Mahmud",
      studentId: "C231189",
      cgpa: "3.62",
      credits: 92,
      semester: "7th",
      status: "Active",
      email: "junaid@student.iiuc.ac.bd",
      phone: "+880 1234-567892",
      pendingReviews: 0,
    },
    {
      id: 4,
      name: "MD. Ashfaqur Rashid",
      studentId: "C231261",
      cgpa: "3.58",
      credits: 90,
      semester: "7th",
      status: "Active",
      email: "ashfaq@student.iiuc.ac.bd",
      phone: "+880 1234-567893",
      pendingReviews: 1,
    },
    {
      id: 5,
      name: "S.M. Asfaqur Rahman",
      studentId: "C231272",
      cgpa: "3.71",
      credits: 94,
      semester: "7th",
      status: "Active",
      email: "asfaq@student.iiuc.ac.bd",
      phone: "+880 1234-567894",
      pendingReviews: 0,
    },
  ];

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPending = students.reduce(
    (sum, student) => sum + student.pendingReviews,
    0
  );
  const averageCGPA = (
    students.reduce((sum, student) => sum + parseFloat(student.cgpa), 0) /
    students.length
  ).toFixed(2);

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
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer">
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
              className="flex items-center space-x-3 px-4 py-3 bg-blue-600 text-white rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">My Students</span>
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
            className="lg:hidden fixed inset-0  bg-opacity-50 z-10"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <div className="hidden lg:block w-64 flex-shrink-0"></div>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Students
            </h2>
            <p className="text-gray-600">
              Manage and view your advisee information
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {students.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalPending}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average CGPA</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {averageCGPA}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Search Students
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow border border-gray-200 p-6"
              >
                {/* Student Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {student.studentId}
                    </p>
                  </div>
                  {student.pendingReviews > 0 && (
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{student.pendingReviews} pending</span>
                    </div>
                  )}
                </div>

                {/* Student Details Grid */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">CGPA</p>
                    <p className="text-lg font-bold text-gray-900">
                      {student.cgpa}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Credits</p>
                    <p className="text-lg font-bold text-gray-900">
                      {student.credits}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Semester</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.semester}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <p className="text-sm font-medium text-gray-900">
                      {student.status}
                    </p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-2 mb-4 border-t-2 border-gray-300 pt-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{student.phone}</span>
                  </div>
                </div>

                {/* View Details Button */}
                <button className="w-full  border border-gray-300 text-sm py-3 rounded-lg font-medium hover:bg-teal-700 hover:text-white transition-colors cursor-pointer">
                  View Details
                </button>
              </div>
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No students found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
