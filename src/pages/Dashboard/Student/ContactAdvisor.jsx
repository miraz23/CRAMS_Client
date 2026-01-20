import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import caplogo from "../../../assets/CAP.png";
import {
  BookOpen,
  Bell,
  LogOut,
  Grid,
  Calendar,
  FileText,
  List,
  AlertCircle,
  CheckCircle,
  XCircle,
  User,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  createExtraCreditRequest,
  getMyExtraCreditRequests,
  fetchSelectedCourses,
  getMyAdvisor,
  bookAppointment,
  getMyAppointments,
  fetchRegistrationStatus,
} from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";
 
function ContactAdvisor() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("extraCredit"); // "extraCredit" or "appointment"
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [selectedData, setSelectedData] = useState({ courses: [], summary: {} });
  const [registrationStatus, setRegistrationStatus] = useState({ registrations: [], summary: {} });
  const [advisorInfo, setAdvisorInfo] = useState(null);
  const [extraCreditForm, setExtraCreditForm] = useState({
    semester: "",
    requestedCredits: "",
    reason: "",
  });
  const [appointmentForm, setAppointmentForm] = useState({
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
  });
 
  const loadData = async () => {
    setLoading(true);
    try {
      // Use Promise.allSettled to handle individual failures gracefully
      const results = await Promise.allSettled([
        getMyExtraCreditRequests().catch(() => []),
        fetchSelectedCourses().catch(() => ({ courses: [], summary: {} })),
        fetchRegistrationStatus().catch(() => ({ registrations: [], summary: {} })),
        getMyAdvisor().catch(() => null),
        getMyAppointments().catch(() => []),
      ]);
 
      // Extract results safely
      const requestsData = results[0].status === 'fulfilled' ? results[0].value : [];
      const selectedCourses = results[1].status === 'fulfilled' ? results[1].value : { courses: [], summary: {} };
      const registrationData = results[2].status === 'fulfilled' ? results[2].value : { registrations: [], summary: {} };
      const advisorData = results[3].status === 'fulfilled' ? results[3].value : null;
      const appointmentsData = results[4].status === 'fulfilled' ? results[4].value : [];
 
      setRequests(requestsData || []);
      setSelectedData(selectedCourses || { courses: [], summary: {} });
      setRegistrationStatus(registrationData || { registrations: [], summary: {} });
      setAdvisorInfo(advisorData || null);
      setAppointments(appointmentsData || []);
 
      // Auto-fill semester from selected courses if available
      if (selectedCourses?.courses?.length > 0 && !extraCreditForm.semester) {
        const semester = selectedCourses.courses[0]?.semester || "";
        if (semester) {
          setExtraCreditForm((prev) => ({ ...prev, semester }));
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
      // Don't show error alert for individual failures, just log them
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  const handleExtraCreditSubmit = async (e) => {
    e.preventDefault();
 
    if (!extraCreditForm.semester) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select a semester." });
      return;
    }
 
    const requested = parseFloat(extraCreditForm.requestedCredits);
    // Backend enforces minimum 1 credit
    if (Number.isNaN(requested) || requested < 1) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please enter a valid number of credits (at least 1)." });
      return;
    }
 
    if (!extraCreditForm.reason || extraCreditForm.reason.trim().length === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide a reason for your request." });
      return;
    }
 
    if (extraCreditForm.reason.length > 500) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Reason cannot exceed 500 characters." });
      return;
    }
 
    setSubmitting(true);
    try {
      await createExtraCreditRequest(
        extraCreditForm.semester,
        parseFloat(extraCreditForm.requestedCredits),
        extraCreditForm.reason
      );
      Swal.fire({
        icon: "success",
        title: "Request Submitted",
        text: "Your extra credit request has been submitted successfully. Please wait for your advisor's approval.",
      });
      setExtraCreditForm({ semester: "", requestedCredits: "", reason: "" });
      await loadData();
    } catch (error) {
      const rawMessage = error.response?.data?.message;
      const message =
        rawMessage === "Invalid: no data provided"
          ? "Request failed: missing data. Please fill Semester, Requested Credits (min 1), and Reason, then try again."
          : rawMessage || "Failed to submit request.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setSubmitting(false);
    }
  };
 
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
 
    if (!appointmentForm.appointmentDate) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select an appointment date." });
      return;
    }
 
    if (!appointmentForm.appointmentTime) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please select an appointment time." });
      return;
    }
 
    if (!appointmentForm.reason || appointmentForm.reason.trim().length === 0) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Please provide a reason for the appointment." });
      return;
    }
 
    if (appointmentForm.reason.length > 500) {
      Swal.fire({ icon: "warning", title: "Validation Error", text: "Reason cannot exceed 500 characters." });
      return;
    }
 
    setSubmitting(true);
    try {
      await bookAppointment(
        appointmentForm.appointmentDate,
        appointmentForm.appointmentTime,
        appointmentForm.reason
      );
      Swal.fire({
        icon: "success",
        title: "Appointment Booked",
        text: "Your appointment request has been submitted successfully. Please wait for your advisor's approval.",
      });
      setAppointmentForm({ appointmentDate: "", appointmentTime: "", reason: "" });
      await loadData();
    } catch (error) {
      const message = error.response?.data?.message || "Failed to book appointment.";
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
 
  // Calculate credits
  const approvedCredits = registrationStatus?.summary?.totalCredits || 0;
  const selectedCredits = selectedData?.summary?.totalCredits || 0;
  const creditLimit = 26;
  const totalCredits = approvedCredits + selectedCredits;
  const extraCreditsNeeded = Math.max(0, totalCredits - creditLimit);
 
  // Pre-fill requested credits with computed extra credit needed (but don't overwrite user edits)
  useEffect(() => {
    if (activeTab !== "extraCredit") return;
    if (submitting) return;
    const current = extraCreditForm.requestedCredits;
    const hasUserValue = current !== "" && current !== null && current !== undefined;
    if (!hasUserValue) {
      setExtraCreditForm((prev) => ({
        ...prev,
        requestedCredits: extraCreditsNeeded > 0 ? String(extraCreditsNeeded) : "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, extraCreditsNeeded, submitting]);
 
  return (
    <div className="flex flex-col h-screen">
      <header className="flex justify-between items-center px-10 py-2 border-b border-gray-200 fixed left-0 w-full bg-white z-10">
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
          <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5 cursor-pointer" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Student Portal</p>
            <p className="text-xs text-gray-500">Contact Advisor</p>
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
 
      <div className="flex flex-1 bg-gray-50">
        <aside className="sidebar border-r border-gray-200 p-4 w-64 left-0 top-16 fixed h-[calc(100vh-4rem)] bg-white">
          <nav className="space-y-1">
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard")}
            >
              <Grid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/routine")}
            >
              <List className="w-5 h-5" />
              <span>Routine</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/courseselection")}
            >
              <BookOpen className="w-5 h-5" />
              <span>Course Selection</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/registrationstatus")}
            >
              <FileText className="w-5 h-5" />
              <span>Registration Status</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/myschedule")}
            >
              <Calendar className="w-5 h-5" />
              <span>My Schedule</span>
            </button>
            <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg">
              <User className="w-5 h-5" />
              <span>Contact Advisor</span>
            </div>
          </nav>
        </aside>
 
        <main className="ml-64 p-4 md:p-8 mt-16 flex flex-col gap-6 flex-1 overflow-y-auto bg-gray-50">
          <div>
            <p className="text-3xl font-bold">Contact Advisor</p>
            <p className="text-lg text-gray-600">
              Request extra credits or book an appointment with your advisor.
            </p>
          </div>
 
          {/* Credit Summary Card */}
          <div className="border border-gray-300 p-6 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Credit Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm text-gray-500 mb-1">Approved Course Credits</p>
                <p className="font-bold text-2xl text-green-600">{approvedCredits}</p>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm text-gray-500 mb-1">Selected Course Credits</p>
                <p className="font-bold text-2xl text-blue-600">{selectedCredits}</p>
              </div>
              <div className="border-r border-gray-200 pr-4">
                <p className="text-sm text-gray-500 mb-1">Credit Limit</p>
                <p className="font-bold text-2xl">{creditLimit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Extra Credit Needed</p>
                <p className="font-bold text-2xl text-orange-600">{extraCreditsNeeded}</p>
              </div>
            </div>
          </div>
 
          {/* Advisor Info Card */}
          {advisorInfo && (
            <div className="border border-gray-300 p-6 rounded-lg bg-white">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Your Advisor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold">{advisorInfo.advisor?.name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold">{advisorInfo.advisor?.email || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mobile</p>
                  <p className="font-semibold">{advisorInfo.advisor?.mobileNumber || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Section</p>
                  <p className="font-semibold">{advisorInfo.section?.sectionName || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
 
          {/* Tabs */}
          <div className="border border-gray-300 rounded-lg bg-white overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab("extraCredit")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "extraCredit"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Request Extra Credits
              </button>
              <button
                onClick={() => setActiveTab("appointment")}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === "appointment"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                Book Appointment
              </button>
            </div>
 
            <div className="p-6">
              {/* Extra Credit Request Tab */}
              {activeTab === "extraCredit" && (
                <div className="space-y-6">
 
                  {/* Request Form */}
                  <form onSubmit={handleExtraCreditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Semester *
                      </label>
                      <input
                        type="text"
                        value={extraCreditForm.semester}
                        onChange={(e) => setExtraCreditForm({ ...extraCreditForm, semester: e.target.value })}
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
                        step="0.1"
                        min="1"
                        value={extraCreditForm.requestedCredits}
                        onChange={(e) => setExtraCreditForm({ ...extraCreditForm, requestedCredits: e.target.value })}
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
                        value={extraCreditForm.reason}
                        onChange={(e) => setExtraCreditForm({ ...extraCreditForm, reason: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        rows="4"
                        placeholder="Please explain why you need extra credits..."
                        maxLength={500}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {extraCreditForm.reason.length}/500 characters
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
 
                  {/* Previous Requests */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-md font-semibold mb-4">My Extra Credit Requests</h4>
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
              )}
 
              {/* Book Appointment Tab */}
              {activeTab === "appointment" && (
                <div className="space-y-6">
                  <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Date *
                      </label>
                      <input
                        type="date"
                        value={appointmentForm.appointmentDate}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentDate: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Appointment Time *
                      </label>
                      <input
                        type="time"
                        value={appointmentForm.appointmentTime}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, appointmentTime: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reason for Appointment *
                      </label>
                      <textarea
                        value={appointmentForm.reason}
                        onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                        className="border border-gray-300 rounded-lg p-2 w-full"
                        rows="4"
                        placeholder="Please explain the reason for this appointment..."
                        maxLength={500}
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {appointmentForm.reason.length}/500 characters
                      </p>
                    </div>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white rounded px-6 py-2 hover:bg-blue-700 disabled:opacity-50"
                      disabled={submitting}
                    >
                      {submitting ? "Booking..." : "Book Appointment"}
                    </button>
                  </form>
 
                  {/* Previous Appointments */}
                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <h4 className="text-md font-semibold mb-4">My Appointments</h4>
                    {loading ? (
                      <p className="text-gray-500">Loading appointments...</p>
                    ) : appointments.length === 0 ? (
                      <p className="text-gray-500">No appointments found.</p>
                    ) : (
                      <div className="space-y-4">
                        {appointments.map((appointment) => (
                          <div
                            key={appointment._id}
                            className={`border rounded-lg p-4 ${getStatusColor(appointment.status)}`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(appointment.status)}
                                <span className="font-semibold capitalize">{appointment.status}</span>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium">
                                  {new Date(appointment.appointmentDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-600">{appointment.appointmentTime}</p>
                              </div>
                            </div>
                            <div className="mt-2 space-y-1">
                              <p className="text-sm">
                                <span className="font-medium">Reason:</span> {appointment.reason}
                              </p>
                              {appointment.advisorFeedback && (
                                <p className="text-sm mt-2">
                                  <span className="font-medium">Advisor Feedback:</span> {appointment.advisorFeedback}
                                </p>
                              )}
                              <p className="text-xs mt-2 opacity-75">
                                Booked: {new Date(appointment.createdAt).toLocaleString()}
                                {appointment.reviewedAt && (
                                  <> • Reviewed: {new Date(appointment.reviewedAt).toLocaleString()}</>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
 
export default ContactAdvisor;