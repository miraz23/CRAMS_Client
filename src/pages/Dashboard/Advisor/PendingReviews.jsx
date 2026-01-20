import React, { useState, useEffect } from "react";
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
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth/useAuth";
import { 
  getPendingReviews, 
  bulkApproveRegistrations, 
  bulkRejectRegistrations,
  approveRegistration,
  rejectRegistration
} from "../../../api/teacherApi";
import Swal from "sweetalert2";
 
export default function PendingReviews() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ totalPending: 0, withIssues: 0 });
  const [selectedReview, setSelectedReview] = useState(null);
 
  useEffect(() => {
    fetchPendingReviews();
  }, []);
 
  const fetchPendingReviews = async () => {
    try {
      setLoading(true);
      const data = await getPendingReviews();
      setSummary(data.summary || { totalPending: 0, withIssues: 0 });
 
      // Format reviews for display
      const formattedReviews = (data.reviews || []).map((review, index) => ({
        id: index + 1,
        name: review.studentName || "Unknown Student",
        studentId: review.studentIdNumber || "",
        email: review.email || "",
        currentCredits: review.currentCredits || 0,
        requestedCredits: review.requestedCredits || 0,
        totalCourses: review.totalCourses || 0,
        submittedDate: review.submittedAtFormatted || "N/A",
        hasIssues: review.hasIssues || false,
        courses: (review.courses || []).map((course) => ({
          code: course.courseCode || "",
          name: course.courseName || "",
          credits: course.credits || 0,
          issues: course.issues || [],
          registrationId: course.registrationId, // Store registration ID for approve/reject
        })),
        studentMongoId: review.studentId, // MongoDB ObjectId
        registrationIds: (review.courses || []).map(course => course.registrationId).filter(Boolean), // All registration IDs for this student
      }));
      setReviews(formattedReviews);
    } catch (error) {
      console.error("Error fetching pending reviews:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load pending reviews",
      });
    } finally {
      setLoading(false);
    }
  };
 
  const handleApproveAll = async (review) => {
    if (!review.studentMongoId || !review.registrationIds || review.registrationIds.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to approve: Missing registration information",
      });
      return;
    }
 
    // Debug: Log registration IDs
    console.log("Approving registrations:", {
      studentId: review.studentMongoId,
      registrationIds: review.registrationIds,
      totalCourses: review.totalCourses,
      registrationIdsCount: review.registrationIds.length
    });
 
    const result = await Swal.fire({
      title: "Approve All Courses?",
      html: `Approve all <b>${review.totalCourses}</b> course(s) for <b>${review.name}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve All",
      cancelButtonText: "Cancel",
    });
 
    if (!result.isConfirmed) return;
 
    try {
      const response = await bulkApproveRegistrations(
        review.studentMongoId,
        review.registrationIds,
        "Approved by advisor"
      );
 
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: `${response.data?.approvedCount || review.totalCourses} course(s) for ${review.name} have been approved.`,
          timer: 2000,
        });
        // Refresh the reviews list
        fetchPendingReviews();
      }
    } catch (error) {
      console.error("Error approving registrations:", error);
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: error.response?.data?.message || "Failed to approve courses",
      });
    }
  };
 
  const handleRejectAll = async (review) => {
    if (!review.studentMongoId || !review.registrationIds || review.registrationIds.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to reject: Missing registration information",
      });
      return;
    }
 
    const result = await Swal.fire({
      title: "Reject All Courses?",
      html: `Reject all <b>${review.totalCourses}</b> course(s) for <b>${review.name}</b>?`,
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (optional)",
      inputPlaceholder: "Enter reason for rejection...",
      inputAttributes: {
        "aria-label": "Rejection reason"
      },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject All",
      cancelButtonText: "Cancel",
    });
 
    if (!result.isConfirmed) return; // User cancelled
 
    try {
      const response = await bulkRejectRegistrations(
        review.studentMongoId,
        review.registrationIds,
        result.value || "Rejected by advisor"
      );
 
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: `All courses for ${review.name} have been rejected.`,
          timer: 2000,
        });
        // Refresh the reviews list
        fetchPendingReviews();
      }
    } catch (error) {
      console.error("Error rejecting registrations:", error);
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: error.response?.data?.message || "Failed to reject courses",
      });
    }
  };
 
  const handleApproveCourse = async (course, studentName) => {
    if (!course.registrationId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to approve: Missing registration information",
      });
      return;
    }
 
    const result = await Swal.fire({
      title: "Approve Course?",
      html: `Approve <b>${course.code} - ${course.name}</b> for <b>${studentName}</b>?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
    });
 
    if (!result.isConfirmed) return;
 
    try {
      const response = await approveRegistration(course.registrationId, "Approved by advisor");
 
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Approved!",
          text: `${course.code} has been approved.`,
          timer: 2000,
        });
        // Refresh the reviews list
        fetchPendingReviews();
        // Close the detail view if it's open
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Error approving registration:", error);
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: error.response?.data?.message || "Failed to approve course",
      });
    }
  };
 
  const handleRejectCourse = async (course, studentName) => {
    if (!course.registrationId) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Unable to reject: Missing registration information",
      });
      return;
    }
 
    const result = await Swal.fire({
      title: "Reject Course?",
      html: `Reject <b>${course.code} - ${course.name}</b> for <b>${studentName}</b>?`,
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (optional)",
      inputPlaceholder: "Enter reason for rejection...",
      inputAttributes: {
        "aria-label": "Rejection reason"
      },
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
    });
 
    if (!result.isConfirmed) return;
 
    try {
      const response = await rejectRegistration(
        course.registrationId,
        result.value || "Rejected by advisor"
      );
 
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Rejected!",
          text: `${course.code} has been rejected.`,
          timer: 2000,
        });
        // Refresh the reviews list
        fetchPendingReviews();
        // Close the detail view if it's open
        setSelectedReview(null);
      }
    } catch (error) {
      console.error("Error rejecting registration:", error);
      Swal.fire({
        icon: "error",
        title: "Rejection Failed",
        text: error.response?.data?.message || "Failed to reject course",
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
            <Link
              to="/advisor/dashboard/extra-credit-requests"
              className="flex items-center space-x-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <CheckCircle className="w-5 h-5" />
              <span
                className="font-medium"
                onClick={() => navigate("/advisor/dashboard/extra-credit-requests")}
              >
                Advising Support
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
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : summary.totalPending || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">With Issues</p>
                <p className="text-3xl font-bold text-red-600">
                  {loading ? "..." : summary.withIssues || 0}
                </p>
              </div>
            </div>
          </div>
 
          {/* Reviews Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading pending reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
              <p className="text-gray-500 text-lg">No pending reviews at the moment</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Courses
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reviews.map((review) => (
                      <React.Fragment key={review.id}>
                        <tr 
                          className={`hover:bg-gray-50 cursor-pointer ${
                            selectedReview?.id === review.id ? 'bg-blue-50' : ''
                          } ${review.hasIssues ? 'bg-red-50' : ''}`}
                          onClick={() => setSelectedReview(selectedReview?.id === review.id ? null : review)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                {selectedReview?.id === review.id ? (
                                  <ChevronDown className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                              </div>
                              <div className="ml-2">
                                <div className="text-sm font-medium text-gray-900">
                                  {review.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{review.studentId}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{review.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{review.totalCourses}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {review.requestedCredits}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{review.submittedDate}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {review.hasIssues ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Issues
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                OK
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveAll(review);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                                title="Approve All"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRejectAll(review);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Reject All"
                              >
                                <ThumbsDown className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {selectedReview?.id === review.id && (
                          <tr>
                            <td colSpan="8" className="px-6 py-4 bg-gray-50">
                              <div className="space-y-4">
                                {/* Student Details Header */}
                                <div className="border-b border-gray-200 pb-3">
                                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    Student Details
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="text-gray-600">Name: </span>
                                      <span className="font-medium text-gray-900">{review.name}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Student ID: </span>
                                      <span className="font-medium text-gray-900">{review.studentId}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Email: </span>
                                      <span className="font-medium text-gray-900">{review.email}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Current Credits: </span>
                                      <span className="font-medium text-gray-900">{review.currentCredits}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Total Courses: </span>
                                      <span className="font-medium text-gray-900">{review.totalCourses}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Requested Credits: </span>
                                      <span className="font-medium text-gray-900">{review.requestedCredits}</span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Submitted Date: </span>
                                      <span className="font-medium text-gray-900">{review.submittedDate}</span>
                                    </div>
                                  </div>
                                </div>
 
                                {/* Courses Details */}
                                <div>
                                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                                    Course Registrations
                                  </h4>
                                  <div className="space-y-3">
                                    {review.courses.map((course, idx) => (
                                      <div
                                        key={idx}
                                        className={`${
                                          course.issues.length > 0
                                            ? "bg-red-50 border-red-200"
                                            : "bg-white border-gray-200"
                                        } rounded-lg p-4 border`}
                                      >
                                        <div className="flex items-start justify-between">
                                          <div className="flex space-x-2">
                                            <h5 className="font-semibold text-gray-900">
                                              {course.code} - {course.name}
                                            </h5>
                                            <span className="text-sm font-medium text-gray-700 bg-white px-3 py-1 rounded border border-gray-200">
                                              {course.credits} Credits
                                            </span>
                                          </div>
 
                                          <div className="flex justify-end space-x-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleApproveCourse(course, review.name);
                                              }}
                                              className="flex items-center justify-center space-x-1 bg-blue-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer"
                                            >
                                              <ThumbsUp className="w-3.5 h-3.5" />
                                              <span>Approve</span>
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleRejectCourse(course, review.name);
                                              }}
                                              className="flex items-center justify-center space-x-1 bg-red-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium hover:bg-red-700 cursor-pointer"
                                            >
                                              <ThumbsDown className="w-3.5 h-3.5" />
                                              <span>Reject</span>
                                            </button>
                                          </div>
                                        </div>
 
                                        {course.issues.length > 0 && (
                                          <div className="mb-3">
                                            <p className="text-xs font-medium text-red-800 mb-1">Issues:</p>
                                            <div className="flex flex-wrap gap-2">
                                              {course.issues.map((issue, i) => (
                                                <span
                                                  key={i}
                                                  className="inline-flex items-center space-x-1 bg-red-600 text-white text-xs px-2 py-1 rounded"
                                                >
                                                  <AlertCircle className="w-3 h-3" />
                                                  <span>{typeof issue === 'object' && issue.message ? issue.message : issue}</span>
                                                </span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
 
                                      </div>
                                    ))}
                                  </div>
                                </div>
 
                                {/* Action Buttons */}
                                <div className="flex justify-end space-x-3 pt-3 border-t border-gray-200">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleApproveAll(review);
                                    }}
                                    className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 cursor-pointer"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                    <span>Approve All</span>
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRejectAll(review);
                                    }}
                                    className="flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 cursor-pointer"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                    <span>Reject All</span>
                                  </button>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}