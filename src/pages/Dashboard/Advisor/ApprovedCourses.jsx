import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  RefreshCw,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth/useAuth";
import { getApprovedCourses } from "../../../api/teacherApi";
import Swal from "sweetalert2";
 
export default function ApprovedCourses() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [approvedCourses, setApprovedCourses] = useState([]);
  const [summary, setSummary] = useState({ totalApproved: 0, approvedThisWeek: 0, totalCredits: 0 });
  const isInitialMount = useRef(true);
 
  useEffect(() => {
    fetchApprovedCourses();
  }, []);
 
  // Refresh data when navigating to this page
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Refresh when location changes (user navigates to this page)
    if (location.pathname === '/advisor/dashboard/approvedcourses') {
      fetchApprovedCourses();
    }
  }, [location.pathname]);
 
  // Refresh data when page comes into focus (user switches tabs/windows)
  // Only refresh if we're on the approved courses page
  useEffect(() => {
    const handleFocus = () => {
      if (location.pathname === '/advisor/dashboard/approvedcourses') {
        fetchApprovedCourses();
      }
    };
 
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [location.pathname]);
 
  const fetchApprovedCourses = async () => {
    try {
      setLoading(true);
      const data = await getApprovedCourses();
 
      setSummary(data.summary || { totalApproved: 0, approvedThisWeek: 0, totalCredits: 0 });
 
      // Format approved courses for display
      const formattedCourses = (data.recentApprovals || []).map((course, index) => ({
        id: index + 1,
        code: course.courseCode || "",
        name: course.courseName || "",
        credits: course.credits || 0,
        studentName: course.studentName || "Unknown",
        studentId: course.studentId || "",
        approvedDate: course.approvalDateFormatted || "N/A",
        feedback: course.advisorFeedback || "",
      }));
      setApprovedCourses(formattedCourses);
    } catch (error) {
      console.error("Error fetching approved courses:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load approved courses",
      });
    } finally {
      setLoading(false);
    }
  };
 
  const handleExport = async () => {
    try {
      const data = await getApprovedCourses({ format: 'csv' });
      // The backend should return CSV data, but if it returns JSON, we need to handle it
      // For now, just show a message
      Swal.fire({
        icon: "info",
        title: "Export",
        text: "CSV export functionality will be implemented",
      });
    } catch (error) {
      console.error("Error exporting:", error);
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: error.response?.data?.message || "Failed to export data",
      });
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
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                    >
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
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2 cursor-pointer"
                      >
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
            <Link
              to="/advisor/dashboard/extra-credit-requests"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Advising Support</span>
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
            <div className="flex items-center space-x-2">
              <button 
                onClick={fetchApprovedCourses}
                disabled={loading}
                className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Refresh data"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 font-medium cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>
 
          {/* Stats Cards */}
          {loading ? (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8 animate-pulse">
              <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-16"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-8">
              <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-6">
                <div className="lg:border-r-2 lg:border-gray-200 md:border-r-2 md:border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">Total Approved</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {summary.totalApproved || 0}
                  </p>
                </div>
                <div className="lg:border-r-2 lg:border-gray-200 md:border-r-2 md:border-gray-200">
                  <p className="text-sm text-gray-600 mb-1">This Week</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {summary.approvedThisWeek || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Credits</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {summary.totalCredits || 0}
                  </p>
                </div>
              </div>
            </div>
          )}
 
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
 
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading approved courses...</p>
              </div>
            ) : approvedCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No approved courses found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Approved Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {approvedCourses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm font-semibold text-gray-900">
                              {course.code}
                            </span>
                            <span className="ml-2 inline-flex items-center space-x-1 bg-teal-600 text-white text-xs px-2 py-0.5 rounded">
                              <CheckCircle className="w-3 h-3" />
                              <span>Approved</span>
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{course.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.studentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                            {course.credits}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{course.approvedDate}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {course.feedback || (
                              <span className="text-gray-400 italic">No feedback</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}