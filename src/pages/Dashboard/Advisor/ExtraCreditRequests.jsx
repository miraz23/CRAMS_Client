import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
} from "lucide-react";
import useAuth from "../../../hooks/useAuth/useAuth";
import {
  getPendingExtraCreditRequests,
  approveExtraCreditRequest,
  rejectExtraCreditRequest,
} from "../../../api/teacherApi";

export default function ExtraCreditRequests() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [processingId, setProcessingId] = useState(null);
  const [feedback, setFeedback] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getPendingExtraCreditRequests();
      setRequests(data || []);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load extra credit requests.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    const advisorFeedback = feedback[requestId] || "";
    
    const result = await Swal.fire({
      title: "Approve Extra Credit Request?",
      text: "Are you sure you want to approve this request?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10b981",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Approve",
      cancelButtonText: "Cancel",
      input: "textarea",
      inputLabel: "Advisor Feedback (Optional)",
      inputPlaceholder: "Add any comments or feedback...",
      inputValue: advisorFeedback,
      inputAttributes: {
        maxlength: 500,
      },
    });

    if (result.isConfirmed) {
      setProcessingId(requestId);
      try {
        await approveExtraCreditRequest(requestId, result.value || "");
        Swal.fire({
          icon: "success",
          title: "Approved",
          text: "Extra credit request approved successfully.",
        });
        await fetchRequests();
        setFeedback((prev) => {
          const updated = { ...prev };
          delete updated[requestId];
          return updated;
        });
      } catch (error) {
        const message = error.response?.data?.message || "Failed to approve request.";
        Swal.fire({ icon: "error", title: "Error", text: message });
      } finally {
        setProcessingId(null);
      }
    }
  };

  const handleReject = async (requestId) => {
    const advisorFeedback = feedback[requestId] || "";
    
    const result = await Swal.fire({
      title: "Reject Extra Credit Request?",
      text: "Please provide a reason for rejection.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Reject",
      cancelButtonText: "Cancel",
      input: "textarea",
      inputLabel: "Rejection Reason *",
      inputPlaceholder: "Please explain why this request is being rejected...",
      inputValue: advisorFeedback,
      inputAttributes: {
        required: true,
        maxlength: 500,
      },
      inputValidator: (value) => {
        if (!value || value.trim().length === 0) {
          return "Rejection reason is required";
        }
        return null;
      },
    });

    if (result.isConfirmed) {
      setProcessingId(requestId);
      try {
        await rejectExtraCreditRequest(requestId, result.value);
        Swal.fire({
          icon: "success",
          title: "Rejected",
          text: "Extra credit request rejected successfully.",
        });
        await fetchRequests();
        setFeedback((prev) => {
          const updated = { ...prev };
          delete updated[requestId];
          return updated;
        });
      } catch (error) {
        const message = error.response?.data?.message || "Failed to reject request.";
        Swal.fire({ icon: "error", title: "Error", text: message });
      } finally {
        setProcessingId(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
              >
                {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h1 className="ml-4 lg:ml-0 text-xl font-semibold text-gray-900">
                Extra Credit Requests
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <User className="w-5 h-5 text-gray-600" />
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button
                      onClick={async () => {
                        try {
                          await logoutUser();
                          navigate("/login");
                        } catch (error) {
                          console.error("Logout error:", error);
                          navigate("/login");
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
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
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:transition-none`}
        >
          <div className="h-full flex flex-col">
            <nav className="flex-1 px-4 py-6 space-y-1">
              <button
                onClick={() => navigate("/advisor/dashboard")}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </button>
              <button
                onClick={() => navigate("/advisor/dashboard/pendingreviews")}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Clock className="w-5 h-5" />
                <span>Pending Reviews</span>
              </button>
              <button
                onClick={() => navigate("/advisor/dashboard/mystudents")}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span>My Students</span>
              </button>
              <button
                onClick={() => navigate("/advisor/dashboard/approvedcourses")}
                className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <CheckCircle className="w-5 h-5" />
                <span>Approved Courses</span>
              </button>
              <button
                onClick={() => navigate("/advisor/dashboard/extra-credit-requests")}
                className="flex items-center gap-3 w-full px-4 py-3 text-left bg-blue-50 text-blue-700 rounded-lg"
              >
                <BookOpen className="w-5 h-5" />
                <span>Extra Credit Requests</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading extra credit requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No pending extra credit requests</p>
                <p className="text-gray-500 text-sm mt-2">
                  All extra credit requests have been reviewed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white rounded-lg border border-gray-200 shadow-sm p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-lg">
                          <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {request.student?.name || "Unknown Student"}
                          </h3>
                          <p className="text-sm text-gray-600">
                            Student ID: {request.student?.studentId || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Email: {request.student?.email || "N/A"}
                          </p>
                          <p className="text-sm text-gray-600">
                            Section: {request.student?.section || "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="w-4 h-4 mr-1" />
                          Pending
                        </span>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(request.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4 space-y-3">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Semester</p>
                        <p className="text-gray-900">{request.semester}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Requested Credits</p>
                        <p className="text-gray-900 text-lg font-semibold">
                          {request.requestedCredits} credit{request.requestedCredits !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Reason</p>
                        <p className="text-gray-900 whitespace-pre-wrap">{request.reason}</p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4 flex gap-3">
                      <button
                        onClick={() => handleApprove(request._id)}
                        disabled={processingId === request._id}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processingId === request._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleReject(request._id)}
                        disabled={processingId === request._id}
                        className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {processingId === request._id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Processing...
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4" />
                            Reject
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
