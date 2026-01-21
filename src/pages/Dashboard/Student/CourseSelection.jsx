import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  BookOpen,
  Clock,
  LogOut,
  Grid,
  Calendar,
  FileText,
  Search,
  Users,
  Check,
  AlertTriangle,
  Plus,
  List,
  User,
} from "lucide-react";
import StudentSidebar from "../../../Components/StudentSidebar/StudentSidebar";
import {
  addCourseSelection,
  fetchAvailableCourses,
  fetchSelectedCourses,
  removeCourseSelection,
  submitCoursesForApproval,
  getMyExtraCreditRequests,
} from "../../../api/studentApi";
import { listTeachers } from "../../../api/adminApi";
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
  const [teachers, setTeachers] = useState([]);
  const [selectedSections, setSelectedSections] = useState({}); // courseId -> sectionId
  const [isSelectionLocked, setIsSelectionLocked] = useState(false);
 
  const departmentFilter = useMemo(
    () => (department === "All Departments" ? undefined : department),
    [department]
  );
 
  const fetchTeachers = async () => {
    try {
      const response = await listTeachers();
      if (response.data.success) {
        setTeachers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      // Silently fail - instructor names will show as IDs if teachers can't be fetched
    }
  };
 
  const loadCourses = async () => {
    setLoading(true);
    try {
      const [available, selected, extraRequests] = await Promise.all([
        fetchAvailableCourses({
          search: search || undefined,
          department: departmentFilter,
        }),
        fetchSelectedCourses(),
        getMyExtraCreditRequests().catch(() => []),
      ]);
      setAvailableCourses(available || []);
      setSelectedData(selected || { courses: [], summary: {} });
      setIsSelectionLocked(Array.isArray(extraRequests) && extraRequests.some((r) => r?.status === "approved"));
 
      // Debug: Log selected data to check structure
      console.log('Selected Data:', selected);
      console.log('Total Credits:', selected?.summary?.totalCredits);
 
      // Initialize selected sections from available courses
      const sectionsMap = {};
      (available || []).forEach(course => {
        if (course.selectedSectionId) {
          sectionsMap[course.id] = course.selectedSectionId;
        } else if (course.isRegular && course.sections && course.sections.length > 0) {
          // For regular students, auto-select their section
          sectionsMap[course.id] = course.sections[0].id;
        }
      });
      setSelectedSections(sectionsMap);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load courses.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchTeachers();
  }, []);
 
  useEffect(() => {
    loadCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentFilter]);
 
  const handleSectionChange = (courseId, sectionId) => {
    setSelectedSections(prev => ({
      ...prev,
      [courseId]: sectionId
    }));
  };
 
  const handleCourseToggle = async (course) => {
    try {
      if (course.isSelected) {
        await removeCourseSelection(course.id);
        Swal.fire({ icon: "success", title: "Removed", text: "Course removed from selection." });
        // Clear selected section
        setSelectedSections(prev => {
          const updated = { ...prev };
          delete updated[course.id];
          return updated;
        });
      } else {
        if (isSelectionLocked) {
          Swal.fire({
            icon: "warning",
            title: "Course selection locked",
            text: "You can’t add more courses because extra credit has already been approved for you.",
          });
          return;
        }
        // Determine section ID to use
        let sectionIdToUse = null;
        if (course.sections && course.sections.length > 0) {
          if (course.isRegular) {
            // Regular students: always use their section (first/only section)
            sectionIdToUse = course.sections[0].id;
          } else {
            // Irregular students: require section selection
            sectionIdToUse = selectedSections[course.id];
            if (!sectionIdToUse) {
              Swal.fire({ 
                icon: "warning", 
                title: "Section Required", 
                text: "Please select a section before adding the course." 
              });
              return;
            }
          }
        }
        const response = await addCourseSelection(course.id, sectionIdToUse);
        // Check if there's a warning about credit limit
        if (response?.warning) {
          Swal.fire({ 
            icon: "warning", 
            title: "Course Added", 
            text: response.warning,
            confirmButtonText: "OK"
          });
        }
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
              <div className="border-r-2 border-gray-200 pr-6">
                <p className="text-gray-500 font-semibold">Total Credits</p>
                <p className="font-bold text-2xl">
                  {selectedData?.summary?.totalCredits ?? 0}
                </p>
              </div>
              <div>
                <p className="text-gray-500 font-semibold">Credit Limit</p>
                <p className="font-bold text-2xl">26</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700 disabled:opacity-50"
                onClick={handleSubmitForApproval}
                disabled={submitting || (selectedData?.summary?.selectedCount || 0) === 0}
              >
                {submitting ? "Submitting..." : "Submit for Approval"}
              </button>
            </div>
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Semester</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Code</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Credits</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Section</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Instructor</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Schedule</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Seats</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prerequisite</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredCourses.map((course) => {
                      const hasSeats = course.seats?.available > 0;
                      const isRegistered = course.isRegistered && !course.isSelected;
                      const registrationStatus = course.registrationStatus;
                      const prerequisiteClear = course.prerequisiteClear !== false; // Default to true if not provided
                      const missingPrerequisites = course.missingPrerequisites || [];
 
                      const getStatusBadge = () => {
                        if (registrationStatus === "approved") return { text: "Approved", color: "bg-green-600" };
                        if (registrationStatus === "pending") return { text: "Pending", color: "bg-yellow-600" };
                        if (registrationStatus === "rejected") return { text: "Rejected", color: "bg-red-600" };
                        return null;
                      };
                      const statusBadge = getStatusBadge();
 
                      // Get selected section
                      // Priority: 1. course.selectedSectionId (from registration for submitted/approved courses)
                      // 2. For regular students, use their section (first/only section in array)
                      // 3. For irregular students, use the selected section from state
                      const isSubmittedOrApproved = (course.isSelected && (registrationStatus === 'pending' || registrationStatus === 'approved')) || isRegistered;
                      const selectedSectionId = course.selectedSectionId 
                        ? course.selectedSectionId
                        : (course.isRegular 
                          ? (course.sections && course.sections.length > 0 ? course.sections[0].id : null)
                          : (selectedSections[course.id] || null));
 
                      // Find section by matching IDs (handle both string and object ID formats)
                      const selectedSection = selectedSectionId 
                        ? course.sections?.find(s => {
                            const sectionId = s.id?.toString();
                            const searchId = selectedSectionId?.toString();
                            return sectionId === searchId || s.id === selectedSectionId;
                          })
                        : (course.isRegular && course.sections && course.sections.length > 0 ? course.sections[0] : null);
 
                      // Helper function to get instructor name by ID
                      const getInstructorName = (instructorId) => {
                        // First try to find in teachers array
                        const teacher = teachers.find((t) => t.teacherId === instructorId);
                        if (teacher?.name) return teacher.name;
 
                        // Then try to match with instructorNames array from backend
                        if (Array.isArray(course.instructors) && Array.isArray(course.instructorNames)) {
                          const index = course.instructors.findIndex(id => id === instructorId);
                          if (index >= 0 && course.instructorNames[index]) {
                            return course.instructorNames[index];
                          }
                        }
 
                        // Fallback to ID if name not found
                        return instructorId;
                      };
 
                      // Get instructor for selected section
                      let instructorNames = "—";
 
                      // Check if course uses section-specific instructor assignments
                      const hasSectionSpecificInstructors = course.instructorSections && 
                        Array.isArray(course.instructorSections) && 
                        course.instructorSections.length > 0;
 
                      if (selectedSection) {
                        // Always check for section-specific instructor first when a section is selected
                        if (hasSectionSpecificInstructors) {
                          // Find instructor assigned to this specific section
                          // Use case-insensitive matching to handle any case differences
                          const sectionNameUpper = selectedSection.sectionName?.toUpperCase().trim();
                          const sectionInstructor = course.instructorSections.find(instSec => {
                            if (!instSec.sections || !Array.isArray(instSec.sections)) return false;
                            return instSec.sections.some(sec => 
                              sec?.toUpperCase().trim() === sectionNameUpper
                            );
                          });
 
                          if (sectionInstructor && sectionInstructor.instructorId) {
                            const instructorId = sectionInstructor.instructorId;
                            instructorNames = getInstructorName(instructorId);
                          } else {
                            // Section-specific assignments exist but this section has no instructor assigned
                            // Fallback to general course instructors for submitted/approved courses
                            if (isSubmittedOrApproved) {
                              instructorNames =
                                Array.isArray(course.instructorNames) && course.instructorNames.length > 0
                                  ? course.instructorNames.join(", ")
                                  : Array.isArray(course.instructors) && course.instructors.length > 0
                                  ? course.instructors
                                      .map((id) => getInstructorName(id))
                                      .filter(Boolean)
                                      .join(", ")
                                  : course.instructor || "—";
                            } else {
                              instructorNames = "—";
                            }
                          }
                        } else {
                          // No section-specific assignments: fallback to general course instructors
                          instructorNames =
                            Array.isArray(course.instructorNames) && course.instructorNames.length > 0
                              ? course.instructorNames.join(", ")
                              : Array.isArray(course.instructors) && course.instructors.length > 0
                              ? course.instructors
                                  .map((id) => getInstructorName(id))
                                  .filter(Boolean)
                                  .join(", ")
                              : course.instructor || "—";
                        }
                      } else if (isSubmittedOrApproved) {
                        // For submitted/approved courses without section, show general instructors
                        instructorNames =
                          Array.isArray(course.instructorNames) && course.instructorNames.length > 0
                            ? course.instructorNames.join(", ")
                            : Array.isArray(course.instructors) && course.instructors.length > 0
                            ? course.instructors
                                .map((id) => getInstructorName(id))
                                .filter(Boolean)
                                .join(", ")
                            : course.instructor || "—";
                      } else {
                        // No section selected: show — (irregular students must select a section first)
                        instructorNames = "—";
                      }
 
                      return (
                        <tr key={course.id} className={isRegistered ? "bg-gray-50" : "bg-white"}>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.semester || "—"}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-700">{course.courseCode}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.courseName}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{course.credits || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {course.sections && course.sections.length > 0 ? (
                              (course.isRegular || isSubmittedOrApproved) ? (
                                // Regular students OR submitted/approved courses: show section name as text (no dropdown)
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-700">
                                    {selectedSection?.sectionName || course.sections[0]?.sectionName || "—"}
                                  </span>
                                </div>
                              ) : (
                                // Irregular students (not yet submitted/approved): show dropdown
                                <select
                                  className="border rounded-lg p-2 text-sm min-w-[150px] bg-white cursor-pointer text-gray-700"
                                  value={selectedSections[course.id] || ""}
                                  onChange={(e) => handleSectionChange(course.id, e.target.value)}
                                >
                                  <option value="">Select Section</option>
                                  {course.sections.map((section) => (
                                    <option key={section.id} value={section.id}>
                                      {section.sectionName}
                                    </option>
                                  ))}
                                </select>
                              )
                            ) : (
                              <span className="text-gray-700">No sections available</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {selectedSection ? instructorNames : (instructorNames || "—")}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {(() => {
                              // Use section schedule if available, otherwise fall back to course schedule for submitted/approved courses
                              const scheduleToShow = selectedSection?.schedule || (isSubmittedOrApproved ? course.schedule : null);
 
                              if (!scheduleToShow) {
                                return "—";
                              }
 
                              // Handle new daySchedules structure (per-day scheduling)
                              if (scheduleToShow?.daySchedules && Array.isArray(scheduleToShow.daySchedules) && scheduleToShow.daySchedules.length > 0) {
                                return (
                                  <>
                                    {scheduleToShow.daySchedules.map((ds, idx) => (
                                      <span key={idx}>
                                        {ds.day}: {ds.startTime || '—'} - {ds.endTime || '—'}
                                        {idx < scheduleToShow.daySchedules.length - 1 ? ', ' : ''}
                                      </span>
                                    ))}
                                  </>
                                );
                              }
 
                              // Handle legacy structure (single time for all days)
                              if ((scheduleToShow?.days || []).length > 0) {
                                return (
                                  <>
                                    {scheduleToShow.days.join(", ")}
                                    {scheduleToShow?.startTime && scheduleToShow?.endTime 
                                      ? ` ${scheduleToShow.startTime} - ${scheduleToShow.endTime}`
                                      : scheduleToShow?.startTime 
                                      ? ` ${scheduleToShow.startTime}`
                                      : ""
                                    }
                                  </>
                                );
                              }
 
                              return "—";
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {(() => {
                              if (selectedSection) {
                                const isRegular = course.isRegular;
                                const seats = isRegular ? selectedSection.regularSeats : selectedSection.irregularSeats;
 
                                return (
                                  <span>
                                    {seats.enrolled}/{seats.max}
                                  </span>
                                );
                              } else if (isSubmittedOrApproved && course.seats) {
                                // Fallback to course-level seat info if section not found for submitted/approved courses
                                return (
                                  <span>
                                    {course.seats.enrolled}/{course.seats.total}
                                  </span>
                                );
                              }
                              return <span className="text-gray-700">—</span>;
                            })()}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            <div className="flex flex-col gap-1">
                              <span>{course.prerequisite || "—"}</span>
                              {!prerequisiteClear && course.prerequisite && (
                                <span className="text-xs text-red-600 font-semibold">
                                  Prerequisite not met
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <button
                              className={`flex py-1.5 px-3 rounded-lg gap-2 items-center ${
                                isRegistered
                                  ? registrationStatus === "approved"
                                    ? "bg-green-600 text-white cursor-not-allowed"
                                    : "bg-gray-400 text-white cursor-not-allowed"
                                  : course.isSelected && registrationStatus === 'pending'
                                  ? "bg-yellow-600 text-white cursor-not-allowed"
                                  : course.isSelected && registrationStatus === "approved"
                                  ? "bg-green-600 text-white cursor-not-allowed"
                                  : course.isSelected
                                  ? "bg-blue-600 text-white cursor-pointer"
                                  : isSelectionLocked && !course.isSelected
                                  ? "bg-gray-400 text-white cursor-not-allowed"
                                  : !prerequisiteClear && !course.isSelected
                                  ? "border border-gray-400 text-gray-400 cursor-not-allowed"
                                  : "border border-gray-400 text-gray-700 cursor-pointer"
                              }`}
                              onClick={() =>
                                !isRegistered &&
                                registrationStatus !== "pending" &&
                                prerequisiteClear &&
                                !(isSelectionLocked && !course.isSelected) &&
                                handleCourseToggle(course)
                              }
                              disabled={
                                isRegistered ||
                                registrationStatus === "pending" ||
                                (isSelectionLocked && !course.isSelected) ||
                                (!prerequisiteClear && !course.isSelected)
                              }
                              title={
                                isRegistered 
                                  ? `Course is already ${registrationStatus}` 
                                  : registrationStatus === 'pending' 
                                  ? "Course submitted for approval"
                                  : isSelectionLocked && !course.isSelected
                                  ? "Course selection is locked after extra credit approval"
                                  : !prerequisiteClear && !course.isSelected
                                  ? `Prerequisites not clear. Missing: ${missingPrerequisites.join(', ') || course.prerequisite}. Only courses approved by advisor are considered as passed.`
                                  : ""
                              }
                            >
                              {course.isSelected ? (
                                <Check className="w-4" />
                              ) : isRegistered ? (
                                <Check className="w-4" />
                              ) : (
                                <Plus className="w-4" />
                              )}
                              <span className="font-semibold text-sm">
                                {course.isSelected && registrationStatus === 'pending'
                                  ? "Submitted"
                                  : course.isSelected
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
        </div>
      </div>
    </div>
  );
}
 
export default CourseSelection;