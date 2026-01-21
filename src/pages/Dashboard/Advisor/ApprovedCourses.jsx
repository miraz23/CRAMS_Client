import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  CheckCircle,
  Download,
  RefreshCw,
} from "lucide-react";
import AdvisorSidebar from "../../../Components/AdvisorSidebar/AdvisorSidebar";
import useAuth from "../../../hooks/useAuth/useAuth";
import { getApprovedCourses } from "../../../api/teacherApi";
import Swal from "sweetalert2";
 
export default function ApprovedCourses() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logoutUser } = useAuth();
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
 
  return (
    <div className="flex h-screen bg-gray-50">
      <AdvisorSidebar
        onLogout={async () => {
          try {
            await logoutUser();
            navigate("/login");
          } catch (error) {
            console.error("Logout error:", error);
            navigate("/login");
          }
        }}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
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
          </div>
        </div>
      </div>
    </div>
  );
}