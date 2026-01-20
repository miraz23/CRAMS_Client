import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import caplogo from "../../../assets/CAP.png";
import {
  BookOpen,
  Clock,
  CheckCircle,
  Bell,
  LogOut,
  Grid,
  Calendar,
  FileText,
  CircleX,
  List,
  User,
} from "lucide-react";
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

  return (
    <div className="flex flex-col h-screen">
      <header className="header flex justify-between items-center px-10 py-2 border-b border-gray-200 fixed left-0 w-full bg-white z-10">
        <div
          className="left-part flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={caplogo} alt="logo" className="w-14 h-14" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">CRAMS</h1>
            <p className="text-xs text-gray-500">Student</p>
          </div>
        </div>
        <div className="right-part flex items-center gap-4">
          <button className="relative p-2  text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5 cursor-pointer" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Student Portal</p>
            <p className="text-xs text-gray-500">Registration Status</p>
          </div>
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
            className="relative group p-2 flex items-center justify-center hover:bg-gray-50 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>
      </header>
      <div>
        <aside className="sidebar border-r border-gray-200 p-4 md:w-60 lg:w-64 left-0 fixed top-16 h-[calc(100vh-4rem)] bg-white">
          <nav className="space-y-1 ">
            <button
              className="flex items-center gap-3 p-4 w-full text-left"
              onClick={() => {
                navigate("/student/dashboard");
              }}
            >
              <Grid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              className="flex items-center gap-3 p-4 w-full text-left"
              onClick={() => navigate("/student/dashboard/routine")}
            >
              <List className="w-5 h-5" />
              <span>Routine</span>
            </button>
            <button
              className="flex items-center gap-3 p-4 w-full text-left"
              onClick={() => navigate("/student/dashboard/courseselection")}
            >
              <BookOpen className="w-5 h-5" />
              <span> Course Selection</span>
            </button>
            <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg">
              <FileText className="w-5 h-5" />
              <span>Registration Status</span>
            </div>
            <button
              className="flex items-center gap-3 p-4 w-full text-left"
              onClick={() => {
                navigate("/student/dashboard/myschedule");
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>My Schedule</span>
            </button>
            <button
              className="flex items-center gap-3 p-4 w-full text-left"
              onClick={() => navigate("/student/dashboard/contact-advisor")}
            >
              <User className="w-5 h-5" />
              <span>Contact Advisor</span>
            </button>
          </nav>
        </aside>
        <main className="ml-64 p-4 md:p-8 lg:p-8 mt-16 flex flex-col gap-6 md:gap-8 lg:gap-6 flex-1 overflow-y-auto bg-gray-50">
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
        </main>
      </div>
    </div>
  );
}

export default RegistrationStatus;
