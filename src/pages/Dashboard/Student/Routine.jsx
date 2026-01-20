import React, { useEffect, useState } from "react";
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
  X,
  List,
  User,
} from "lucide-react";
import { fetchRoutine } from "../../../api/studentApi";
import useAuth from "../../../hooks/useAuth/useAuth";

// Helper function to parse time string to minutes
const parseTimeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const [time, period] = timeStr.split(' ');
  const [hours, minutes] = time.split(':');
  let hour24 = parseInt(hours, 10);
  if (period === 'PM' && hour24 !== 12) hour24 += 12;
  if (period === 'AM' && hour24 === 12) hour24 = 0;
  return hour24 * 60 + parseInt(minutes || 0, 10);
};

// Helper function to check if a time falls within a time range
const isTimeInRange = (timeStr, startTime, endTime) => {
  const timeMinutes = parseTimeToMinutes(timeStr);
  const startMinutes = parseTimeToMinutes(startTime);
  const endMinutes = parseTimeToMinutes(endTime);
  
  if (timeMinutes === null || startMinutes === null || endMinutes === null) return false;
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

// Course Details Modal Component
const CourseDetailsModal = ({ course, isOpen, onClose }) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md border-2 border-gray-400" onClick={onClose} >
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Course Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="border-b pb-3">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-gray-900">{course.courseCode}</h3>
            </div>
            <p className="text-lg text-gray-700 font-medium">{course.courseName}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Credits</p>
              <p className="text-gray-900">{course.credits || 0}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Semester</p>
              <p className="text-gray-900">{course.semester || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Instructor</p>
              <p className="text-gray-900">{course.instructor || "—"}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 mb-1">Prerequisite</p>
              <p className="text-gray-900">{course.prerequisite || "None"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 mb-2">Schedule</p>
            {course.schedule?.daySchedules && course.schedule.daySchedules.length > 0 ? (
              <div className="space-y-2">
                {course.schedule.daySchedules.map((ds, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-gray-900">
                      {ds.day}: {ds.startTime || '—'} - {ds.endTime || '—'}
                      {ds.room && <span className="ml-2 text-gray-600">({ds.room})</span>}
                    </p>
                  </div>
                ))}
              </div>
            ) : course.schedule?.days && course.schedule.days.length > 0 ? (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-900">
                  Days: {course.schedule.days.join(", ")}
                  {course.schedule?.startTime && course.schedule?.endTime && (
                    <span className="ml-2">
                      • {course.schedule.startTime} - {course.schedule.endTime}
                    </span>
                  )}
                  {course.schedule?.room && (
                    <span className="ml-2 text-gray-600">({course.schedule.room})</span>
                  )}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 text-sm">—</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Schedule Grid Component
const ScheduleGrid = ({ weeklySchedule, courses, onCourseClick }) => {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'];
  const dayNames = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday'];
  
  // Time slots based on the image
  const timeSlots = [
    { start: '10:40 AM', end: '11:30 AM' },
    { start: '11:30 AM', end: '12:20 PM' },
    { start: '12:20 PM', end: '1:10 PM' },
    { start: '1:10 PM', end: '1:50 PM' },
    { start: '1:50 PM', end: '2:40 PM' },
    { start: '2:40 PM', end: '3:30 PM' },
    { start: '3:30 PM', end: '4:20 PM' },
  ];

  // Create a map of time slots to classes
  const scheduleMap = {};
  days.forEach((day) => {
    scheduleMap[day] = {};
    timeSlots.forEach((slot, idx) => {
      scheduleMap[day][idx] = [];
    });
  });

  // Populate schedule map - place classes in the time slot they fall into
  Object.keys(weeklySchedule).forEach((day) => {
    if (!scheduleMap[day]) return;
    weeklySchedule[day].forEach((cls) => {
      const classStartMinutes = parseTimeToMinutes(cls.startTime);
      const classEndMinutes = parseTimeToMinutes(cls.endTime);
      
      if (classStartMinutes !== null) {
        // Find which time slot this class belongs to
        timeSlots.forEach((slot, idx) => {
          const slotStartMinutes = parseTimeToMinutes(slot.start);
          const slotEndMinutes = parseTimeToMinutes(slot.end);
          
          // Check if class overlaps with this time slot
          if (slotStartMinutes !== null && slotEndMinutes !== null) {
            // Class starts during this slot or overlaps with it
            if ((classStartMinutes >= slotStartMinutes && classStartMinutes < slotEndMinutes) ||
                (classEndMinutes !== null && classEndMinutes > slotStartMinutes && classStartMinutes < slotEndMinutes)) {
              scheduleMap[day][idx].push(cls);
            }
          }
        });
      }
    });
  });

  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full">
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-300 bg-gray-50 p-3 text-left font-semibold text-gray-700">
                Day
              </th>
              {timeSlots.map((slot, idx) => (
                <th key={idx} className="border border-gray-300 bg-gray-50 p-3 text-center font-semibold text-gray-700">
                  <div className="text-sm">{slot.start}</div>
                  <div className="text-xs text-gray-600 mt-1">-</div>
                  <div className="text-sm">{slot.end}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map((day, dayIdx) => (
              <tr key={day}>
                <td className="border border-gray-300 bg-gray-50 p-3 text-sm font-medium text-gray-700">
                  {dayNames[dayIdx]}
                </td>
                {timeSlots.map((slot, slotIdx) => (
                  <td key={`${day}-${slotIdx}`} className="border border-gray-300 p-2 align-top" style={{ minHeight: '60px', width: '150px' }}>
                    {scheduleMap[day] && scheduleMap[day][slotIdx] && scheduleMap[day][slotIdx].length > 0 ? (
                      scheduleMap[day][slotIdx].map((cls, idx) => {
                        // Find the full course details from the courses array
                        const fullCourse = courses.find(c => c.id === cls.courseId || c._id === cls.courseId);
                        return (
                          <div
                            key={`${cls.courseId}-${idx}`}
                            className="bg-blue-600 text-white rounded p-2 mb-1 text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                            onClick={() => fullCourse && onCourseClick(fullCourse)}
                          >
                            <div className="font-semibold">{cls.courseCode}</div>
                            <div className="text-xs mt-1">{cls.room || '—'}</div>
                          </div>
                        );
                      })
                    ) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function Routine() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [routine, setRoutine] = useState({ weeklySchedule: {}, summary: {}, courses: [] });
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadRoutine = async () => {
    setLoading(true);
    try {
      const data = await fetchRoutine();
      setRoutine(data);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to load routine.";
      Swal.fire({ icon: "error", title: "Error", text: message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRoutine();
  }, []);

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
          <button className="relative p-2  text-gray-600 hover:bg-gray-50 rounded-lg">
            <Bell className="w-5 h-5 cursor-pointer" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">Student Portal</p>
            <p className="text-xs text-gray-500">Routine</p>
          </div>
          <button
            onClick={handleLogout}
            className="relative group p-2 flex items-center justify-center hover:bg-gray-50 rounded-lg"
            title="Logout"
          >
            <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 bg-gray-50">
        <aside className="sidebar border-r border-gray-200 p-4 md:w-60 lg:w-64 left-0 fixed top-16 h-[calc(100vh-4rem)] bg-white">
          <nav className="space-y-1 ">
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard")}
            >
              <Grid className="w-5 h-5" />
              <span>Dashboard</span>
            </button>
            <div className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg">
              <List className="w-5 h-5" />
              <span>Routine</span>
            </div>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/courseselection")}
            >
              <BookOpen className="w-5 h-5" />
              <span> Course Selection</span>
            </button>
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => {
                navigate("/student/dashboard/registrationstatus");
              }}
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
            <button
              className="flex w-full items-center gap-3 p-4 text-left"
              onClick={() => navigate("/student/dashboard/contact-advisor")}
            >
              <User className="w-5 h-5" />
              <span>Contact Advisor</span>
            </button>
          </nav>
        </aside>
        <main className="ml-64 p-4 md:p-8 mt-16 flex flex-col gap-6 flex-1 overflow-y-auto bg-gray-50">
          <div>
            <p className="text-3xl font-bold mb-1">Routine</p>
            <p className="text-lg text-gray-500">All courses in your section for {routine.semester || "Spring 2025"}.</p>
          </div>
          <div className="border border-gray-300 p-6 rounded-lg bg-white">
            <div className="mb-4">
              <p className="text-lg font-semibold">Weekly Schedule</p>
              <p className="text-gray-500 text-sm">View all class timings and locations for your section</p>
            </div>
            {loading && <p className="text-gray-500 mt-4">Loading routine...</p>}
            {!loading && (
              <ScheduleGrid 
                weeklySchedule={routine.weeklySchedule || {}} 
                courses={routine.courses || []}
                onCourseClick={(course) => {
                  setSelectedCourse(course);
                  setIsModalOpen(true);
                }}
              />
            )}
          </div>

          <CourseDetailsModal
            course={selectedCourse}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setSelectedCourse(null);
            }}
          />
        </main>
      </div>
    </div>
  );
}

export default Routine;

