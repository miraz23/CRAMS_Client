import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { CheckCircle, XCircle } from "lucide-react";
import AdvisorSidebar from "../../../Components/AdvisorSidebar/AdvisorSidebar";
import useAuth from "../../../hooks/useAuth/useAuth";
import {
  getPendingExtraCreditRequests,
  approveExtraCreditRequest,
  rejectExtraCreditRequest,
} from "../../../api/teacherApi";
 
export default function ExtraCreditRequests() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
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
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Advising Support
              </h2>
              <p className="text-gray-600">
                View your recently approved course registrations
              </p>
            </div>
          <div className="mt-4 max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading advising support requests...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No pending advising support requests</p>
                <p className="text-gray-500 text-sm mt-2">
                  All advising support requests have been reviewed.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Section
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Student ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Approved Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Selected Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Max Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Requested Credits
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {requests.map((request) => (
                        <tr key={request._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.student?.section || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.student?.studentId || "N/A"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {request.student?.name || "Unknown Student"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.approvedCredits ?? 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.selectedCredits ?? 0}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.maxCredits ?? 26}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {request.requestedCredits}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-3">
                              <button
                                onClick={() => handleApprove(request._id)}
                                disabled={processingId === request._id}
                                className="text-blue-600 hover:text-blue-900 disabled:opacity-50"
                                title="Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleReject(request._id)}
                                disabled={processingId === request._id}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                title="Reject"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
