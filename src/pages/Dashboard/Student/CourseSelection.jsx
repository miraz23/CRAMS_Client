import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import caplogo from "../../../assets/CAP.png";
import {
  BookOpen,
  Clock,
  Bell,
  LogOut,
  Grid,
  Calendar,
  FileText,
  Search,
  Users,
  Check,
  AlertTriangle,
  Plus,
} from "lucide-react";
import {
  addCourseSelection,
  fetchAvailableCourses,
  fetchSelectedCourses,
  removeCourseSelection,
  submitCoursesForApproval,
} from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";

function CourseSelection() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [availableCourses, setAvailableCourses] = useState([]);
  const [selectedData, setSelectedData] = useState({ courses: [], summary: {} });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const departmentFilter = useMemo(
    () => (department === "All Departments" ? undefined : department),
    [department]
  );

  const loadCourses = async () => {
    setLoading(true);
    try {
      const [available, selected] = await Promise.all([
        fetchAvailableCourses({
          search: search || undefined,
          department: departmentFilter,
        }),
        fetchSelectedCourses(),
      ]);
      setAvailableCourses(available || []);
      setSelectedData(selected || { courses: [], summary: {} });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load courses.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentFilter]);

  const handleCourseToggle = async (course) => {
    try {
      if (course.isSelected) {
        await removeCourseSelection(course.id);
        Swal.fire({ icon: "success", title: "Removed", text: "Course removed from selection." });
      } else {
        await addCourseSelection(course.id);
        Swal.fire({ icon: "success", title: "Added", text: "Course added to selection." });
      }
      await loadCourses();
    } catch (error) {
      const message = error.response?.data?.message || "Update failed.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    }
  };

  const handleSubmitForApproval = async () => {
    setSubmitting(true);
    try {
      await submitCoursesForApproval();
      Swal.fire({ icon: "success", title: "Submitted", text: "Courses submitted for approval." });
      await loadCourses();
    } catch (error) {
      const message = error.response?.data?.message || "Submission failed.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCourses = useMemo(() => {
    if (!search) return availableCourses;
    const term = search.toLowerCase();
    return availableCourses.filter(
      (course) =>
        course.courseCode?.toLowerCase().includes(term) ||
        course.courseName?.toLowerCase().includes(term) ||
        course.instructor?.toLowerCase().includes(term)
    );
  }, [availableCourses, search]);

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
            <p className="text-xs text-gray-500">Course Selection</p>
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
          <nav className="space-y-1 ">
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard")}
            >
              <Grid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg">
              <BookOpen className="w-5 h-5" />
              <span>Course Selection</span>
            </div>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/myschedule")}
            >
              <Calendar className="w-5 h-5" />
              <span>My Schedule</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/registrationstatus")}
            >
              <FileText className="w-5 h-5" />
              <span>Registration Status</span>
            </button>
          </nav>
        </aside>

        <main className="ml-64 p-4 md:p-8 mt-16 flex flex-col gap-6 flex-1 overflow-y-auto bg-gray-50">
          <div>
            <p className="text-3xl font-bold">Course Selection</p>
            <p className="text-lg text-gray-600">
              Browse and manage courses directly from the CRAMS API.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row border border-gray-300 p-6 rounded-lg justify-between items-center gap-4 bg-white">
            <div className="flex gap-6">
              <div className="border-r-2 border-gray-200 pr-6">
                <p className="text-gray-500 font-semibold">Selected Courses</p>
                <p className="font-bold text-2xl">
                  {selectedData?.summary?.selectedCount ?? selectedData?.courses?.length ?? 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Total Credits</p>
                <p className="font-bold text-2xl">
                  {selectedData?.summary?.totalCredits ?? 0}
                </p>
              </div>
            </div>
            <button
              className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
              onClick={handleSubmitForApproval}
              disabled={submitting || (selectedData?.summary?.selectedCount || 0) === 0}
            >
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>
          </div>

          <div className="border border-gray-300 p-6 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
            <div className="w-full md:w-2/3">
              <p className="text-lg font-semibold">Search Courses</p>
              <div className="flex border border-gray-300 rounded-lg p-2 gap-2 items-center">
                <Search className="w-4" />
                <input
                  className="border-none outline-none w-full"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by course name, code, or instructor..."
                />
              </div>
            </div>
            <div className="w-full md:w-1/3">
              <p className="text-lg font-semibold">Department</p>
              <select
                className="border border-gray-300 rounded-lg p-2 w-full"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option>All Departments</option>
                <option>CSE</option>
                <option>EEE</option>
                <option>ETE</option>
                <option>CCE</option>
                <option>Civil</option>
              </select>
            </div>
            <button
              className="bg-gray-900 text-white rounded px-4 py-2"
              onClick={loadCourses}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Apply"}
            </button>
          </div>

          <section className="space-y-4">
            {loading && <p className="text-gray-500">Loading courses...</p>}
            {!loading && filteredCourses.length === 0 && (
              <p className="text-gray-500">No courses found for the current filters.</p>
            )}

            {!loading && filteredCourses.length > 0 && (
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Credits</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Instructor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Schedule</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prerequisite</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Seats</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => {
                      const hasSeats = course.seats?.available > 0;
                      const isRegistered = course.isRegistered && !course.isSelected;
                      const registrationStatus = course.registrationStatus;

                      const getStatusBadge = () => {
                        if (registrationStatus === "approved") return { text: "Approved", color: "bg-green-600" };
                        if (registrationStatus === "pending") return { text: "Pending", color: "bg-yellow-600" };
                        if (registrationStatus === "rejected") return { text: "Rejected", color: "bg-red-600" };
                        return null;
                      };
                      const statusBadge = getStatusBadge();

                      return (
                        <tr key={course.id} className={isRegistered ? "bg-gray-50 opacity-75" : "bg-white"}>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{course.courseCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.courseName}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.credits || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.department || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {Array.isArray(course.instructors) && course.instructors.length > 0
                              ? course.instructors.join(", ")
                              : course.instructor || "TBA"}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {(course.schedule?.days || []).join(", ")}{" "}
                            {course.schedule?.startTime ? `${course.schedule.startTime} - ${course.schedule.endTime}` : ""}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.prerequisite || "—"}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <span className={`font-semibold ${hasSeats ? "text-green-600" : "text-red-600"}`}>
                              {course.seats?.available ?? 0}/{course.seats?.total ?? 0}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              className={`flex py-1.5 px-3 rounded-lg gap-2 items-center ${
                                isRegistered
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : course.isSelected
                                  ? "bg-blue-600 text-white cursor-pointer"
                                  : "border border-gray-400 text-gray-700 cursor-pointer"
                              }`}
                              onClick={() => !isRegistered && handleCourseToggle(course)}
                              disabled={isRegistered}
                              title={isRegistered ? `Course is already ${registrationStatus}` : ""}
                            >
                              {course.isSelected ? (
                                <Check className="w-4" />
                              ) : isRegistered ? (
                                <Check className="w-4" />
                              ) : (
                                <Plus className="w-4" />
                              )}
                              <span className="font-semibold text-sm">
                                {course.isSelected
                                  ? "Selected"
                                  : isRegistered
                                  ? statusBadge?.text || "Registered"
                                  : "Add"}
                              </span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

export default CourseSelection;
