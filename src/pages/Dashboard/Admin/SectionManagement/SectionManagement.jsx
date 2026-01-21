import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Bell, LogOut, Menu } from "lucide-react";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import { listSections, getSection, createSection, updateSection, deleteSection, listAdvisors, listCourses, updateCourse, listTeachers, updateSectionCourseSchedule, populateSectionsFromStudents } from "../../../../api/adminApi";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useUserRole from "../../../../hooks/useUserRole/useUserRole";

// Add/Edit Modal Component
const SectionModal = ({ isOpen, onClose, onSave, section, advisors = [] }) => {
  const isEditing = !!section;
  const [formData, setFormData] = useState({
    sectionName: "",
    semester: "",
    assignedAdvisor: "",
    regularStudents: 0,
    maxIrregularStudents: 0,
    totalCapacity: 0,
    // enrolledStudents is managed automatically from student data after CSV upload
    crName: "",
    crContact: "",
    acrName: "",
    acrContact: "",
  });

  // Keep local form state in sync with the passed-in section when editing
  useEffect(() => {
    if (section) {
      const regularStudents = section.enrolledStudents || 0;
      const maxIrregularStudents = section.maxIrregularStudents || 0;
      const totalCapacity = regularStudents + maxIrregularStudents;
      setFormData({
        ...section,
        regularStudents,
        maxIrregularStudents,
        totalCapacity,
      });
    } else {
      setFormData({
        sectionName: "",
        semester: "",
        assignedAdvisor: "",
        regularStudents: 0,
        maxIrregularStudents: 0,
        totalCapacity: 0,
        crName: "",
        crContact: "",
        acrName: "",
        acrContact: ""
      });
    }
  }, [section, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]:
          e.target.type === "number"
            ? value === ""
              ? ""
              : parseInt(value)
            : value,
      };
      
      // Calculate totalCapacity when regularStudents or maxIrregularStudents change
      if (name === "regularStudents" || name === "maxIrregularStudents") {
        const regularStudents = name === "regularStudents" 
          ? (value === "" ? 0 : parseInt(value) || 0)
          : (prev.regularStudents || 0);
        const maxIrregularStudents = name === "maxIrregularStudents"
          ? (value === "" ? 0 : parseInt(value) || 0)
          : (prev.maxIrregularStudents || 0);
        updated.totalCapacity = regularStudents + maxIrregularStudents;
      }
      
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Section" : "Add New Section"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full flex gap-2">
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
              <input
                type="text"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                placeholder="Semester"
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Section Name</label>
              <input
                type="text"
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                placeholder="Section Name"
                className="w-full border p-3 rounded-lg"
                required
              />
            </div>
          </div>
          <div className="w-full flex gap-2">
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Advisor</label>
                <select
                  name="assignedAdvisor"
                  value={formData.assignedAdvisor}
                  onChange={handleChange}
                  className="w-full border p-3 rounded-lg"
                  required
                >
                  <option value="">Select Advisor</option>
                  {advisors.map((advisor) => (
                    <option key={advisor.id} value={advisor.teacherId}>
                      {advisor.name} ({advisor.teacherId})
                    </option>
                  ))}
                </select>
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity</label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  placeholder="Total Capacity"
                  className="w-full border p-3 rounded-lg bg-gray-100"
                  readOnly
                  required
                />
            </div>
          </div>
          <div className="w-full flex gap-2">
          <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Regular Students</label>
                <input
                  type="number"
                  name="regularStudents"
                  value={formData.regularStudents}
                  onChange={handleChange}
                  placeholder="Regular Students"
                  min="0"
                  className="w-full border p-3 rounded-lg bg-gray-100"
                  readOnly
                  required
                />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Irregular Students</label>
                <input
                  type="number"
                  name="maxIrregularStudents"
                  value={formData.maxIrregularStudents}
                  onChange={handleChange}
                  placeholder="Maximum Irregular Students"
                  min="0"
                  max="50"
                  className="w-full border p-3 rounded-lg"
                  required
                />
            </div>
          </div>
          <div className="w-full flex gap-2">
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CR Name</label>
            <input
              type="text"
              name="crName"
              value={formData.crName}
              onChange={handleChange}
              placeholder="CR Name"
              className="w-full border p-3 rounded-lg"
              required
            />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">CR Contact</label>
            <input
              type="text"
              name="crContact"
              value={formData.crContact}
              onChange={handleChange}
              placeholder="CR Contact"
              className="w-full border p-3 rounded-lg"
              required
            />
            </div>
          </div>
          <div className="w-full flex gap-2">
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ACR Name</label>
            <input
              type="text"
              name="acrName"
              value={formData.acrName}
              onChange={handleChange}
              placeholder="ACR Name"
              className="w-full border p-3 rounded-lg"
              required
            />
            </div>
            <div className="w-full flex flex-col gap-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">ACR Contact</label>
            <input
              type="text"
              name="acrContact"
              value={formData.acrContact}
              onChange={handleChange}
              placeholder="ACR Contact"
              className="w-full border p-3 rounded-lg"
              required
            />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {isEditing ? "Save Changes" : "Add Section"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Delete Confirmation Modal
const DeleteModal = ({ isOpen, onClose, onConfirm, section }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full">
        <h3 className="text-lg font-bold mb-2 text-gray-800">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete section{" "}
          <span className="font-semibold">{section?.sectionName}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(section.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow-md">
    <h4 className="text-sm text-gray-500">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

// Helper functions for time conversion
const convertTimeTo24Hour = (timeStr) => {
  if (!timeStr) return '';
  // If already in 24-hour format (HH:MM), return as is
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr;
  
  // Convert from "10:00 AM" format to "10:00"
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return '';
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = match[3].toUpperCase();
  
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  
  return `${hours.toString().padStart(2, '0')}:${minutes}`;
};

const convertTimeTo12Hour = (timeStr) => {
  if (!timeStr) return '';
  // If already in 12-hour format, return as is
  if (/\d{1,2}:\d{2}\s*(AM|PM)/i.test(timeStr)) return timeStr;
  
  // Convert from "10:00" format to "10:00 AM"
  const match = timeStr.match(/(\d{2}):(\d{2})/);
  if (!match) return '';
  
  let hours = parseInt(match[1]);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';
  
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;
  
  return `${hours}:${minutes} ${period}`;
};

// Parse time string to get hour, minute, and period
const parseTime = (timeStr) => {
  if (!timeStr) return { hour: 12, minute: 0, period: 'AM' };
  
  const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (match) {
    return {
      hour: parseInt(match[1]),
      minute: parseInt(match[2]),
      period: match[3].toUpperCase(),
    };
  }
  
  // Try 24-hour format
  const match24 = timeStr.match(/(\d{2}):(\d{2})/);
  if (match24) {
    let hours = parseInt(match24[1]);
    const minutes = parseInt(match24[2]);
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return { hour: hours, minute: minutes, period };
  }
  
  return { hour: 12, minute: 0, period: 'AM' };
};

// Format time from hour, minute, period
const formatTime = (hour, minute, period) => {
  return `${hour}:${minute.toString().padStart(2, '0')} ${period}`;
};

// Time Picker Component
const TimePicker = ({ value, onChange, placeholder = "Select time" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  useEffect(() => {
    if (value) {
      const parsed = parseTime(value);
      setSelectedHour(parsed.hour);
      setSelectedMinute(parsed.minute);
      setSelectedPeriod(parsed.period);
    }
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      // Scroll to selected values
      setTimeout(() => {
        const hourElement = document.getElementById(`hour-${selectedHour}`);
        const minuteElement = document.getElementById(`minute-${selectedMinute}`);
        if (hourElement) hourElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
        if (minuteElement) minuteElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  }, [isOpen, selectedHour, selectedMinute]);

  const handleHourChange = (hour) => {
    setSelectedHour(hour);
    const newTime = formatTime(hour, selectedMinute, selectedPeriod);
    onChange(newTime);
  };

  const handleMinuteChange = (minute) => {
    setSelectedMinute(minute);
    const newTime = formatTime(selectedHour, minute, selectedPeriod);
    onChange(newTime);
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    const newTime = formatTime(selectedHour, selectedMinute, period);
    onChange(newTime);
  };

  const handleNow = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    const newTime = formatTime(hours, minutes, period);
    setSelectedHour(hours);
    setSelectedMinute(minutes);
    setSelectedPeriod(period);
    onChange(newTime);
  };

  const handleOK = () => {
    setIsOpen(false);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="relative">
      <input
        type="text"
        value={value || ''}
        readOnly
        onClick={() => setIsOpen(!isOpen)}
        placeholder={placeholder}
        className="w-full border p-2 rounded-lg cursor-pointer bg-white"
      />
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl p-4">
            <div className="flex gap-4 items-center">
              {/* Hours Column */}
              <div className="w-16 h-64 overflow-y-auto border-r border-gray-200" style={{ scrollbarWidth: 'thin' }}>
                {hours.map((hour) => (
                  <div
                    key={hour}
                    id={`hour-${hour}`}
                    onClick={() => handleHourChange(hour)}
                    className={`px-3 py-2 text-center cursor-pointer rounded transition-colors ${
                      selectedHour === hour
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {hour.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* Minutes Column */}
              <div className="w-16 h-64 overflow-y-auto border-r border-gray-200" style={{ scrollbarWidth: 'thin' }}>
                {minutes.map((minute) => (
                  <div
                    key={minute}
                    id={`minute-${minute}`}
                    onClick={() => handleMinuteChange(minute)}
                    className={`px-3 py-2 text-center cursor-pointer rounded transition-colors ${
                      selectedMinute === minute
                        ? 'bg-blue-600 text-white font-semibold'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {minute.toString().padStart(2, '0')}
                  </div>
                ))}
              </div>

              {/* AM/PM Column */}
              <div className="w-16 h-64 flex flex-col justify-center gap-2">
                <button
                  onClick={() => handlePeriodChange('AM')}
                  className={`px-3 py-2 text-center cursor-pointer rounded transition-colors ${
                    selectedPeriod === 'AM'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  AM
                </button>
                <button
                  onClick={() => handlePeriodChange('PM')}
                  className={`px-3 py-2 text-center cursor-pointer rounded transition-colors ${
                    selectedPeriod === 'PM'
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  PM
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mt-4 pt-4 border-t">
              <button
                onClick={handleNow}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Now
              </button>
              <button
                onClick={handleOK}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                OK
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Section Detail Modal Component
const SectionDetailModal = ({ isOpen, onClose, section, advisors = [] }) => {
  const [sectionDetails, setSectionDetails] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseSchedules, setCourseSchedules] = useState({});
  const [saving, setSaving] = useState(false);
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (isOpen && section) {
      fetchSectionDetails();
      fetchTeachers();
    }
  }, [isOpen, section]);

  // Fetch courses when sectionDetails is available
  useEffect(() => {
    if (isOpen && section && sectionDetails) {
      fetchCourses();
    }
  }, [isOpen, section, sectionDetails]);

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

  const fetchSectionDetails = async () => {
    try {
      setLoading(true);
      const response = await getSection(section.id);
      if (response.data.success) {
        setSectionDetails(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching section details:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load section details",
      });
    } finally {
      setLoading(false);
    }
  };

  const normalizeTime = (timeStr) => {
    if (!timeStr) return '';
    // If already in 12-hour format, return as is
    if (/\d{1,2}:\d{2}\s*(AM|PM)/i.test(timeStr)) return timeStr.trim();
    // If in 24-hour format, convert to 12-hour
    if (/^\d{2}:\d{2}$/.test(timeStr)) {
      return convertTimeTo12Hour(timeStr);
    }
    // Return as is if format is unclear
    return timeStr.trim();
  };

  const fetchCourses = async (sectionDetailsData = null) => {
    try {
      const response = await listCourses({ semester: section.semester });
      if (response.data.success) {
        const coursesData = response.data.data || [];
        setCourses(coursesData);
        // Initialize course schedules from section-specific schedules or course default
        const schedules = {};
        // Use provided sectionDetailsData or fall back to state
        const sectionDataToUse = sectionDetailsData || sectionDetails;
        const sectionCourseSchedules = sectionDataToUse?.courseSchedules || {};
        
        coursesData.forEach(course => {
          const courseId = course.id;
          
          // First, check if section has a specific schedule for this course
          if (sectionCourseSchedules[courseId]) {
            const sectionSchedule = sectionCourseSchedules[courseId];
            
            // Check if new daySchedules structure exists
            if (sectionSchedule.daySchedules && Array.isArray(sectionSchedule.daySchedules) && sectionSchedule.daySchedules.length > 0) {
              schedules[courseId] = {
                daySchedules: sectionSchedule.daySchedules.map(ds => ({
                  day: ds.day,
                  startTime: normalizeTime(ds.startTime || ''),
                  endTime: normalizeTime(ds.endTime || ''),
                  room: ds.room || '',
                })),
              };
            } else {
              // Convert legacy structure to new format
              const days = Array.isArray(sectionSchedule.days) ? [...sectionSchedule.days] : [];
              const startTime = normalizeTime(sectionSchedule.startTime || '');
              const endTime = normalizeTime(sectionSchedule.endTime || '');
              const room = sectionSchedule.room || '';
              
              schedules[courseId] = {
                daySchedules: days.map(day => ({
                  day,
                  startTime,
                  endTime,
                  room,
                })),
              };
            }
          } else {
            // Fall back to course default schedule
            const courseSchedule = course.schedule || {};
            
            if (courseSchedule.daySchedules && Array.isArray(courseSchedule.daySchedules) && courseSchedule.daySchedules.length > 0) {
              schedules[courseId] = {
                daySchedules: courseSchedule.daySchedules.map(ds => ({
                  day: ds.day,
                  startTime: normalizeTime(ds.startTime || ''),
                  endTime: normalizeTime(ds.endTime || ''),
                  room: ds.room || '',
                })),
              };
            } else {
              // Convert legacy structure to new format
              const days = Array.isArray(courseSchedule.days) ? [...courseSchedule.days] : [];
              const startTime = normalizeTime(courseSchedule.startTime || '');
              const endTime = normalizeTime(courseSchedule.endTime || '');
              const room = courseSchedule.room || '';
              
              schedules[courseId] = {
                daySchedules: days.map(day => ({
                  day,
                  startTime,
                  endTime,
                  room,
                })),
              };
            }
          }
        });
        setCourseSchedules(schedules);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load courses",
      });
    }
  };

  const handleDayToggle = (courseId, day) => {
    setCourseSchedules(prev => {
      const currentSchedule = prev[courseId] || { daySchedules: [] };
      const daySchedules = currentSchedule.daySchedules || [];
      
      // Check if day already exists
      const existingDayIndex = daySchedules.findIndex(ds => ds.day === day);
      
      let newDaySchedules;
      if (existingDayIndex >= 0) {
        // Remove the day
        newDaySchedules = daySchedules.filter(ds => ds.day !== day);
      } else {
        // Add the day with default empty times (or copy from first existing day if available)
        const defaultStartTime = daySchedules.length > 0 ? daySchedules[0].startTime : '';
        const defaultEndTime = daySchedules.length > 0 ? daySchedules[0].endTime : '';
        const defaultRoom = daySchedules.length > 0 ? daySchedules[0].room : '';
        newDaySchedules = [
          ...daySchedules,
          {
            day,
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            room: defaultRoom,
          },
        ];
      }
      
      return {
        ...prev,
        [courseId]: {
          ...prev[courseId],
          daySchedules: newDaySchedules,
        },
      };
    });
  };

  const handleTimeChange = (courseId, day, field, value) => {
    setCourseSchedules(prev => {
      const currentSchedule = prev[courseId] || { daySchedules: [] };
      const daySchedules = [...(currentSchedule.daySchedules || [])];
      
      const dayIndex = daySchedules.findIndex(ds => ds.day === day);
      if (dayIndex >= 0) {
        daySchedules[dayIndex] = {
          ...daySchedules[dayIndex],
          [field]: value,
        };
      }
      
      return {
        ...prev,
        [courseId]: {
          ...prev[courseId],
          daySchedules,
        },
      };
    });
  };

  const handleRoomChange = (courseId, day, value) => {
    setCourseSchedules(prev => {
      const currentSchedule = prev[courseId] || { daySchedules: [] };
      const daySchedules = [...(currentSchedule.daySchedules || [])];
      
      const dayIndex = daySchedules.findIndex(ds => ds.day === day);
      if (dayIndex >= 0) {
        daySchedules[dayIndex] = {
          ...daySchedules[dayIndex],
          room: value,
        };
      }
      
      return {
        ...prev,
        [courseId]: {
          ...prev[courseId],
          daySchedules,
        },
      };
    });
  };

  const handleSaveSchedule = async (courseId) => {
    try {
      setSaving(true);
      const schedule = courseSchedules[courseId];
      // Normalize times to 12-hour format and save using new daySchedules structure
      const scheduleToSave = {
        daySchedules: (schedule.daySchedules || []).map(ds => ({
          day: ds.day,
          startTime: normalizeTime(ds.startTime || ''),
          endTime: normalizeTime(ds.endTime || ''),
          room: ds.room || '',
        })),
      };
      // Save to section-specific schedule instead of course
      await updateSectionCourseSchedule(section.id, courseId, scheduleToSave);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Schedule updated successfully",
        timer: 1500,
      });
      // Refresh section details and courses to get updated schedules
      const response = await getSection(section.id);
      if (response.data.success) {
        const updatedSectionDetails = response.data.data;
        setSectionDetails(updatedSectionDetails);
        // Pass the updated section details directly to fetchCourses
        await fetchCourses(updatedSectionDetails);
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update schedule",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAllSchedules = async () => {
    try {
      setSaving(true);
      const updatePromises = Object.keys(courseSchedules).map(courseId => {
        const schedule = courseSchedules[courseId];
        const scheduleToSave = {
          daySchedules: (schedule.daySchedules || []).map(ds => ({
            day: ds.day,
            startTime: normalizeTime(ds.startTime || ''),
            endTime: normalizeTime(ds.endTime || ''),
            room: ds.room || '',
          })),
        };
        // Save to section-specific schedule instead of course
        return updateSectionCourseSchedule(section.id, courseId, scheduleToSave);
      });
      await Promise.all(updatePromises);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "All schedules updated successfully",
        timer: 1500,
      });
      // Refresh section details and courses to get updated schedules
      const response = await getSection(section.id);
      if (response.data.success) {
        const updatedSectionDetails = response.data.data;
        setSectionDetails(updatedSectionDetails);
        // Pass the updated section details directly to fetchCourses
        await fetchCourses(updatedSectionDetails);
      }
    } catch (error) {
      console.error('Error updating schedules:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update schedules",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  const advisorName = sectionDetails
    ? advisors.find((advisor) => advisor.teacherId === sectionDetails.assignedAdvisor)?.name ||
      sectionDetails.assignedAdvisor ||
      "N/A"
    : "N/A";

  const daysOfWeek = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

  // Helper function to get instructor name by ID
  const getInstructorName = (instructorId) => {
    // First try to find in teachers array
    const teacher = teachers.find((t) => t.teacherId === instructorId);
    if (teacher?.name) return teacher.name;
    
    // Then try to match with instructorNames array from backend
    // This will be checked per course in the map function
    return instructorId;
  };

  // Helper function to get instructor for a course in this section
  const getCourseInstructor = (course) => {
    const sectionName = sectionDetails?.sectionName || section.sectionName;
    
    // Check if course uses section-specific instructor assignments
    const hasSectionSpecificInstructors = course.instructorSections && 
      Array.isArray(course.instructorSections) && 
      course.instructorSections.length > 0;
    
    // First, try to find instructor assigned to this specific section
    if (sectionName && hasSectionSpecificInstructors) {
      const sectionInstructor = course.instructorSections.find(instSec => 
        instSec.sections && instSec.sections.includes(sectionName)
      );
      
      if (sectionInstructor && sectionInstructor.instructorId) {
        const instructorId = sectionInstructor.instructorId;
        return getInstructorName(instructorId);
      }
      // If section-specific assignments exist but this section has no instructor, return —
      return "—";
    }
    
    // Only fallback to general course instructors if section-specific assignments are NOT being used
    if (!hasSectionSpecificInstructors) {
      if (Array.isArray(course.instructorNames) && course.instructorNames.length > 0) {
        return course.instructorNames.join(", ");
      }
      
      if (Array.isArray(course.instructors) && course.instructors.length > 0) {
        return course.instructors
          .map((id) => getInstructorName(id))
          .filter(Boolean)
          .join(", ");
      }
      
      return course.instructor || "—";
    }
    
    return "—";
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50 p-4 overflow-y-auto">
      <div className="bg-white p-6 rounded-lg w-full max-w-6xl shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Section Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading section details...</p>
          </div>
        ) : (
          <>
            {/* Section Information */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">Section Information</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Section Name</p>
                  <p className="font-semibold">{sectionDetails?.sectionName || section.sectionName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Semester</p>
                  <p className="font-semibold">{sectionDetails?.semester || section.semester}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Advisor</p>
                  <p className="font-semibold">{advisorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="font-semibold">{sectionDetails?.enrolledStudents ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Capacity</p>
                  <p className="font-semibold">{sectionDetails?.totalCapacity ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      sectionDetails?.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {sectionDetails?.status || "N/A"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">CR</p>
                  <p className="font-semibold">
                    {sectionDetails?.crName
                      ? `${sectionDetails.crName} (${sectionDetails.crContact || "N/A"})`
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">ACR</p>
                  <p className="font-semibold">
                    {sectionDetails?.acrName
                      ? `${sectionDetails.acrName} (${sectionDetails.acrContact || "N/A"})`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Courses and Schedule */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Courses for {sectionDetails?.semester || section.semester} Semester</h3>
                <button
                  onClick={handleSaveAllSchedules}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save All Schedules"}
                </button>
              </div>

              {courses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No courses found for this semester.
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {courses.map((course) => {
                    const schedule = courseSchedules[course.id] || {
                      daySchedules: [],
                    };
                    const daySchedules = schedule.daySchedules || [];
                    const selectedDays = daySchedules.map(ds => ds.day);
                    
                    return (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg">{course.courseCode}</h4>
                            <p className="text-sm text-gray-600">{course.courseName}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Credits: {course.credits} | Department: {course.department}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              <span className="font-medium">Instructor:</span> {getCourseInstructor(course)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleSaveSchedule(course.id)}
                            disabled={saving}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50 ml-4"
                          >
                            Save
                          </button>
                        </div>

                        {/* Days Selection */}
                        <div className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Days
                          </label>
                          <div className="flex gap-2 flex-wrap">
                            {daysOfWeek.map((day) => (
                              <button
                                key={day}
                                type="button"
                                onClick={() => handleDayToggle(course.id, day)}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  selectedDays.includes(day)
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                }`}
                              >
                                {day}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Per-Day Time Selection */}
                        {daySchedules.length > 0 && (
                          <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Schedule Times & Room (per day)
                            </label>
                            {daySchedules.map((daySchedule) => (
                              <div key={daySchedule.day} className="border rounded-lg p-3 bg-gray-50">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="font-semibold text-sm text-gray-700 min-w-[50px]">
                                    {daySchedule.day}:
                                  </span>
                                  <div className="flex-1 grid grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Start Time
                                      </label>
                                      <TimePicker
                                        value={daySchedule.startTime || ''}
                                        onChange={(time) => handleTimeChange(course.id, daySchedule.day, 'startTime', time)}
                                        placeholder="Select start time"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        End Time
                                      </label>
                                      <TimePicker
                                        value={daySchedule.endTime || ''}
                                        onChange={(time) => handleTimeChange(course.id, daySchedule.day, 'endTime', time)}
                                        placeholder="Select end time"
                                      />
                                    </div>
                                    <div>
                                      <label className="block text-xs font-medium text-gray-600 mb-1">
                                        Room
                                      </label>
                                      <input
                                        type="text"
                                        value={daySchedule.room || ''}
                                        onChange={(e) => handleRoomChange(course.id, daySchedule.day, e.target.value)}
                                        placeholder="e.g., C-102, CX-201"
                                        className="w-full border p-2 rounded-lg text-sm"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Main Section Management Component
const SectionManagementDashboard = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { role } = useUserRole();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterSemester, setFilterSemester] = useState('');
  const [advisors, setAdvisors] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    fetchSections();
    fetchAdvisors();
  }, [filterSemester]);

  const fetchAdvisors = async () => {
    try {
      const response = await listAdvisors();
      if (response.data.success) {
        setAdvisors(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching advisors:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load advisors",
      });
    }
  };

  const fetchSections = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filterSemester && filterSemester !== 'All Semesters') {
        params.semester = filterSemester;
      }

      const response = await listSections(params);
      if (response.data.success) {
        const sorted = [...(response.data.data || [])].sort((a, b) => {
          const aSem = (a.semester || '').toString();
          const bSem = (b.semester || '').toString();
          const semCompare = aSem.localeCompare(bSem, undefined, { sensitivity: 'base' });
          if (semCompare !== 0) return semCompare;
          const aSec = (a.sectionName || '').toString();
          const bSec = (b.sectionName || '').toString();
          return aSec.localeCompare(bSec, undefined, { sensitivity: 'base' });
        });
        setSections(sorted);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load sections",
      });
    } finally {
      setLoading(false);
    }
  };

  const metrics = useMemo(() => {
    const totalStudents = sections.reduce(
      (acc, s) => acc + (s.enrolledStudents || 0),
      0
    );
    return {
      totalSections: sections.length,
      totalStudents,
    };
  }, [sections]);

  const handleSaveSection = async (sectionData) => {
    try {
      if (sectionData.id) {
        // Update existing section
        const response = await updateSection(sectionData.id, sectionData);
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Section updated successfully",
            timer: 1500,
          });
          fetchSections();
        }
      } else {
        // Create new section
        const response = await createSection(sectionData);
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "Section created successfully",
            timer: 1500,
          });
          fetchSections();
        }
      }
    } catch (error) {
      console.error('Error saving section:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to save section",
      });
    }
  };

  const handleDeleteSection = async (id) => {
    try {
      const response = await deleteSection(id);
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Deleted",
          text: "Section deleted successfully",
          timer: 1500,
        });
        fetchSections();
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete section",
      });
    }
  };

  const handlePopulateSectionsFromStudents = async () => {
    try {
      // Show confirmation dialog
      const result = await Swal.fire({
        title: 'Populate Sections from Student Data?',
        text: 'This will create sections for all distinct section names found in student data. Existing sections will be skipped.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, populate sections',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) {
        return;
      }

      // Show loading
      Swal.fire({
        title: 'Processing...',
        text: 'Populating sections from student data',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await populateSectionsFromStudents();
      
      if (response.data.success) {
        const { created, skipped, sections, skipped: skippedSections } = response.data.data;
        
        let message = `Successfully created ${created} section(s).`;
        if (skipped > 0) {
          message += ` ${skipped} section(s) were skipped (already exist or failed to create).`;
        }

        // Show detailed results
        let detailsHtml = '';
        if (sections && sections.length > 0) {
          detailsHtml += '<div style="text-align: left; margin-top: 10px;"><strong>Created Sections:</strong><ul style="margin-top: 5px;">';
          sections.forEach((sec) => {
            detailsHtml += `<li>${sec.sectionName} (${sec.enrolledStudents} students)</li>`;
          });
          detailsHtml += '</ul></div>';
        }
        if (skippedSections && skippedSections.length > 0) {
          detailsHtml += '<div style="text-align: left; margin-top: 10px;"><strong>Skipped Sections:</strong><ul style="margin-top: 5px;">';
          skippedSections.forEach((sec) => {
            detailsHtml += `<li>${sec.sectionName} - ${sec.reason}</li>`;
          });
          detailsHtml += '</ul></div>';
        }

        Swal.fire({
          icon: "success",
          title: "Sections Populated",
          html: message + detailsHtml,
          confirmButtonText: 'OK',
        });

        // Refresh sections list
        fetchSections();
      }
    } catch (error) {
      console.error('Error populating sections:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to populate sections from student data",
      });
    }
  };

  // Get unique semesters from sections
  const semesters = useMemo(() => {
    const semSet = new Set(sections.map(s => s.semester).filter(Boolean));
    return ['All Semesters', ...Array.from(semSet)];
  }, [sections]);

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
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Section Management</h2>
            <div className="flex gap-3">
              <button
                onClick={handlePopulateSectionsFromStudents}
                className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
                title="Create sections from distinct section names in student data"
              >
                Populate from Students
              </button>
              <button
                onClick={() => {
                  setEditSection(null);
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
              >
                + Add Section
              </button>
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6">
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 bg-white"
            >
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <MetricCard title="Total Sections" value={metrics.totalSections} />
            <MetricCard title="Total Students" value={metrics.totalStudents} />
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4">Loading sections...</p>
            </div>
          ) : sections.length > 0 ? (
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Section</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Semester</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Advisor</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Total Students</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">CR</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">ACR</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sections.map((section) => {
                    const advisorName =
                      advisors.find((advisor) => advisor.teacherId === section.assignedAdvisor)?.name ||
                      section.assignedAdvisor ||
                      "N/A";
                    return (
                      <tr 
                        key={section.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedSection(section);
                          setIsDetailModalOpen(true);
                        }}
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{section.sectionName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{section.semester || "—"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{advisorName}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{section.enrolledStudents ?? 0}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {section.crName ? `${section.crName} (${section.crContact || "N/A"})` : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {section.acrName ? `${section.acrName} (${section.acrContact || "N/A"})` : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              section.status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {section.status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex gap-3" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => {
                                setEditSection(section);
                                setIsModalOpen(true);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <MdOutlineModeEditOutline size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(section)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <RiDeleteBin5Line size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
              No sections found.
            </div>
          )}

          {/* Add/Edit Modal */}
          <SectionModal
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditSection(null);
            }}
            onSave={handleSaveSection}
            section={editSection}
            advisors={advisors}
          />

          {/* Delete Modal */}
          <DeleteModal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={handleDeleteSection}
            section={deleteConfirm}
          />

          {/* Section Detail Modal */}
          <SectionDetailModal
            isOpen={isDetailModalOpen}
            onClose={() => {
              setIsDetailModalOpen(false);
              setSelectedSection(null);
            }}
            section={selectedSection}
            advisors={advisors}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionManagementDashboard;
