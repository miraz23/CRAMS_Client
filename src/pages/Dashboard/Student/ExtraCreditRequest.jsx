import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BookOpen,
  LogOut,
  Grid,
  Calendar,
  FileText,
  List,
  AlertCircle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import StudentSidebar from "../../../Components/StudentSidebar/StudentSidebar";
import {
  createExtraCreditRequest,
  getMyExtraCreditRequests,
  fetchSelectedCourses,
} from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";
 
function ExtraCreditRequest() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [requests, setRequests] = useState([]);
  const [selectedData, setSelectedData] = useState({ courses: [], summary: {} });
  const [formData, setFormData] = useState({
    semester: "",
    requestedCredits: "",
    reason: "",
  });
 
  const loadData = async () => {
    setLoading(true);
    try {
      const [requestsData, selectedCourses] = await Promise.all([
        getMyExtraCreditRequests(),
        fetchSelectedCourses(),
      ]);
      setRequests(requestsData || []);
      setSelectedData(selectedCourses || { courses: [], summary: {} });
 
      // Auto-fill semester from selected courses if available
      if (selectedCourses?.courses?.length > 0) {
        const semester = selectedCourses.courses[0]?.semester || "";
        if (semester && !formData.semester) {
          setFormData((prev) => ({ ...prev, semester }));
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load data.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const handleSubmit = async (e) => {
    e.preventDefault();
 
    if (!formData.semester) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select a semester." });
      return;
    }
 
    if (!formData.requestedCredits || formData.requestedCredits < 1) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please enter a valid number of credits (at least 1)." });
      return;
    }
 
    if (!formData.reason || formData.reason.trim().length === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide a reason for your request." });
      return;
    }
 
    if (formData.reason.length > 500) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Reason cannot exceed 500 characters." });
      return;
    }
 
    setSubmitting(true);
    try {
      await createExtraCreditRequest(
        formData.semester,
        parseInt(formData.requestedCredits),
        formData.reason
      );
      Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Your extra credit request has been submitted successfully. Please wait for your advisor's approval.",
      });
      setFormData({ semester: "", requestedCredits: "", reason: "" });
      await loadData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to submit request.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setSubmitting(false);
    }
  };
 
  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };
 
  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-50 border-green-200 text-green-800";
      case "rejected":
        return "bg-red-50 border-red-200 text-red-800";
      default:
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
    }
  };
 
  const currentCredits = selectedData?.summary?.totalCredits || 0;
  const creditLimit = 26;
  const extraCreditsNeeded = Math.max(0, currentCredits - creditLimit);
 
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
    <div className="flex h-screen bg-gray-50">
      <StudentSidebar onLogout={handleLogout} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/student/dashboard/courseselection")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <p className="text-3xl font-bold">Extra Credit Request</p>
              <p className="text-lg text-gray-600">
                Request additional credits beyond the 26 credit limit per semester.
              </p>
            </div>
          </div>
 
          {/* Credit Summary */}
          <div className="border border-gray-300 p-6 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4">Current Credit Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-gray-500 font-semibold">Current Credits</p>
                <p className="font-bold text-2xl">{currentCredits}</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Credit Limit</p>
                <p className="font-bold text-2xl">26</p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Extra Credits Needed</p>
                <p className="font-bold text-2xl text-orange-600">{extraCreditsNeeded}</p>
              </div>
            </div>
          </div>
 
          {/* Request Form */}
          <div className="border border-gray-300 p-6 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4">Request Extra Credits</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Semester *
                </label>
                <input
                  type="text"
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="e.g., Fall 2024"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Credits *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.requestedCredits}
                  onChange={(e) => setFormData({ ...formData, requestedCredits: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  placeholder="Enter number of extra credits needed"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Minimum: 1 credit. You currently need {extraCreditsNeeded} extra credit(s).
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason *
                </label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="border border-gray-300 rounded-lg p-2 w-full"
                  rows="4"
                  placeholder="Please explain why you need extra credits..."
                  maxLength={500}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.reason.length}/500 characters
                </p>
              </div>
              <button
                type="submit"
                className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
 
          {/* Previous Requests */}
          <div className="border border-gray-300 p-6 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4">My Extra Credit Requests</h3>
            {loading ? (
              <p className="text-gray-500">Loading requests...</p>
            ) : requests.length === 0 ? (
              <p className="text-gray-500">No extra credit requests found.</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className={`border rounded-lg p-4 ${getStatusColor(request.status)}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        <span className="font-semibold capitalize">{request.status}</span>
                      </div>
                      <span className="text-sm">{request.semester}</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Requested Credits:</span> {request.requestedCredits}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Reason:</span> {request.reason}
                      </p>
                      {request.advisorFeedback && (
                        <p className="text-sm mt-2">
                          <span className="font-medium">Advisor Feedback:</span> {request.advisorFeedback}
                        </p>
                      )}
                      <p className="text-xs mt-2 opacity-75">
                        Submitted: {new Date(request.createdAt).toLocaleString()}
                        {request.reviewedAt && (
                          <> • Reviewed: {new Date(request.reviewedAt).toLocaleString()}</>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default ExtraCreditRequest;