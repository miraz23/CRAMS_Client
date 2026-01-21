import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BookOpen,
  Clock,
  CheckCircle,
  LogOut,
  Grid,
  Calendar,
  FileText,
  CircleX,
  List,
  User,
} from "lucide-react";
import StudentSidebar from "../../../Components/StudentSidebar/StudentSidebar";
import { fetchRegistrationStatus } from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";

function RegistrationStatus() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [statusData, setStatusData] = useState({ registrations: [], summary: {} });
  const [loading, setLoading] = useState(false);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await fetchRegistrationStatus();
      setStatusData(data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load registration status.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const summary = statusData.summary || {};

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
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">Registration Status</p>
              <p>Track your course registration approval.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 items-center mb-6">
            <div className="p-6 flex justify-between border border-gray-300 bg-white rounded-lg items-center">
              <div>
                <p className="text-gray-500">Approved</p>
                <p className="text-2xl font-bold">{summary.approved ?? 0}</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="p-6 flex justify-between border border-gray-300 bg-white rounded-lg items-center">
              <div>
                <p className="text-gray-500">Pending</p>
                <p className="text-2xl font-bold">{summary.pending ?? 0}</p>
              </div>
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
            <div className="p-6 flex justify-between border border-gray-300 bg-white rounded-lg items-center">
              <div>
                <p className="text-gray-500">Rejected</p>
                <p className="text-2xl font-bold">{summary.rejected ?? 0}</p>
              </div>
              <CircleX className="w-6 h-6 text-red-600" />
            </div>
          </div>

          <div className="p-6 rounded-lg bg-white shadow">
            <div className="mb-6 flex justify-between items-center">
              <div>
                <p className="text-xl font-bold">Course Registration Details</p>
                <p className="text-gray-500">View status and feedback for each course</p>
              </div>
              <p className="text-sm text-gray-500">
                Total: {summary.total ?? 0} | Credits (approved): {summary.totalCredits ?? 0}
              </p>
            </div>
            {loading && <p className="text-gray-500">Loading registration status...</p>}
            {!loading && (statusData.registrations || []).length === 0 && (
              <p className="text-gray-500">No registrations found.</p>
            )}
            {!loading && (statusData.registrations || []).length > 0 && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Course Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Instructor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Processed At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                        Advisor Feedback
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(statusData.registrations || []).map((reg) => (
                      <tr key={reg.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reg.semester || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{reg.course?.courseCode}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{reg.course?.courseName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{reg.course?.credits ?? 0}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{reg.course?.instructor || "—"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium text-white ${
                              reg.status === "approved"
                                ? "bg-green-600"
                                : reg.status === "pending"
                                ? "bg-gray-500"
                                : "bg-red-600"
                            }`}
                          >
                            {reg.status === "approved" ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : reg.status === "pending" ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <CircleX className="w-4 h-4" />
                            )}
                            <span className="capitalize">{reg.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {reg.submittedAt ? new Date(reg.submittedAt).toLocaleString() : "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {reg.approvedAt
                              ? new Date(reg.approvedAt).toLocaleString()
                              : reg.rejectedAt
                              ? new Date(reg.rejectedAt).toLocaleString()
                              : "—"}
                          </div>
                        </td>
                        <td className="px-6 py-4 min-w-[200px] max-w-[400px]">
                          <div className="text-sm text-gray-600">
                            {reg.status === "approved" ? (
                              reg.advisorFeedback ? (
                                <div className="bg-gray-100 p-2 rounded">
                                  <p className="text-xs break-words whitespace-normal">{reg.advisorFeedback}</p>
                                </div>
                              ) : (
                                <span className="text-gray-700">Approved by advisor</span>
                              )
                            ) : reg.status === "rejected" ? (
                              reg.rejectionReason ? (
                                <p className="text-xs text-red-800 break-words whitespace-normal">{reg.rejectionReason}</p>
                              ) : (
                                "—"
                              )
                            ) : (
                              "—"
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
  );
}

export default RegistrationStatus;
