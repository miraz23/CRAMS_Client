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

function CourseSelection() {
  const navigate = useNavigate();
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
          <button className="relative group p-2 flex items-center justify-center">
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

            {filteredCourses.map((course) => {
              const hasSeats = course.seats?.available > 0;
              return (
                <div
                  key={course.id}
                  className="border border-gray-200 bg-white rounded-lg p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="py-0.5">
                    <div className="flex flex-wrap gap-3 items-center">
                      <p className="font-bold text-xl">{course.courseCode}</p>
                      <p className="border px-2 py-1 font-medium border-gray-300 rounded-lg">
                        {course.credits || 0} Credits
                      </p>
                      {course.hasConflict && (
                        <span className="text-white bg-red-600 p-1 rounded-lg px-2 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4" />
                          Conflict
                        </span>
                      )}
                    </div>
                    <p className="font-semibold mb-1.5">{course.courseName}</p>
                    <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                      <Users className="w-4" />
                      <span>{course.instructor || "TBA"}</span>
                    </div>
                    <div>
                      <p className="text-gray-500">
                        Seats :
                        <span
                          className={`font-semibold ${
                            hasSeats ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {" "}
                          {course.seats?.available ?? 0}/{course.seats?.total ?? 0} available
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-500 flex md:flex-col">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Clock className="w-5 h-5" />
                      <p>
                        {(course.schedule?.days || []).join(", ")}{" "}
                        {course.schedule?.startTime
                          ? `${course.schedule.startTime} - ${course.schedule.endTime}`
                          : ""}
                      </p>
                    </div>
                    {course.prerequisite && (
                      <p>
                        Prerequisite:
                        <span className="text-black font-semibold">
                          {" "}
                          {course.prerequisite}
                        </span>
                      </p>
                    )}
                  </div>
                  <div>
                    <button
                      className={`flex py-2 px-4 rounded-lg gap-2 items-center cursor-pointer ${
                        course.isSelected
                          ? "bg-blue-600 text-white"
                          : "border border-gray-400 text-gray-700"
                      }`}
                      onClick={() => handleCourseToggle(course)}
                    >
                      {course.isSelected ? <Check className="w-5" /> : <Plus className="w-5" />}
                      <p className="font-semibold">
                        {course.isSelected ? "Selected" : "Add"}
                      </p>
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        </main>
      </div>
    </div>
  );
}

export default CourseSelection;
