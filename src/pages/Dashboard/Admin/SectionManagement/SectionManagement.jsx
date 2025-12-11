import React, { useState, useMemo, useEffect } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import useAxiosSecure from "../../../../hooks/useAxiosSecure/useAxiosSecure";
import Swal from "sweetalert2";

// Enrollment Bar Component
const EnrollmentBar = ({ enrolled, capacity, label }) => {
  const available = capacity - enrolled;
  const percentage = capacity > 0 ? (enrolled / capacity) * 100 : 0;

  let barColor;
  if (available <= 2) {
    barColor = "bg-red-500";
  } else {
    barColor = label === "Regular" ? "bg-blue-500" : "bg-green-500";
  }

  return (
    <div className="flex flex-col mb-3">
      <div className="flex justify-between text-sm text-gray-700">
        <span className="font-semibold">{label} Students</span>
        <span className="font-mono">
          {enrolled} / {capacity} seats
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span
        className={`text-xs mt-1 font-medium ${
          available <= 2 ? "text-red-600 font-bold" : "text-green-600"
        }`}
      >
        {available} seats available
      </span>
    </div>
  );
};

// Add/Edit Modal Component
const SectionModal = ({ isOpen, onClose, onSave, section }) => {
  const isEditing = !!section;
  const [formData, setFormData] = useState(
    section || {
      sectionName: "",
      semester: "Spring 2025",
      shift: "Male",
      assignedAdvisor: "",
      totalCapacity: 40,
      enrolledStudents: 0,
      crName: "",
      crContact: "",
      acrName: "",
      acrContact: "",
      status: "active",
    }
  );

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number"
          ? value === ""
            ? ""
            : parseInt(value)
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {isEditing ? "Edit Section" : "Add New Section"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="sectionName"
            value={formData.sectionName}
            onChange={handleChange}
            placeholder="Section Name (e.g., 6EM)"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="semester"
            value={formData.semester}
            onChange={handleChange}
            placeholder="Semester (e.g., Spring 2025)"
            className="w-full border p-3 rounded-lg"
            required
          />
          <select
            name="shift"
            value={formData.shift}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="text"
            name="assignedAdvisor"
            value={formData.assignedAdvisor}
            onChange={handleChange}
            placeholder="Assigned Advisor Name"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="number"
            name="totalCapacity"
            value={formData.totalCapacity}
            onChange={handleChange}
            placeholder="Total Capacity (1-50)"
            min="1"
            max="50"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="number"
            name="enrolledStudents"
            value={formData.enrolledStudents}
            onChange={handleChange}
            placeholder="Enrolled Students"
            min="0"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="crName"
            value={formData.crName}
            onChange={handleChange}
            placeholder="CR Name"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="crContact"
            value={formData.crContact}
            onChange={handleChange}
            placeholder="CR Contact"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="acrName"
            value={formData.acrName}
            onChange={handleChange}
            placeholder="ACR Name"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="acrContact"
            value={formData.acrContact}
            onChange={handleChange}
            placeholder="ACR Contact"
            className="w-full border p-3 rounded-lg"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex justify-end gap-3 pt-4 border-t">
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

// Section Card Component
const SectionCard = ({ section, onEdit, onDelete }) => {
  const totalCap = section.totalCapacity || 0;
  const totalEnrolled = section.enrolledStudents || 0;
  const available = totalCap - totalEnrolled;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-bold">{section.sectionName}</h3>
          <p className="text-sm text-gray-600">
            Semester: {section.semester} | Shift: {section.shift}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <MdOutlineModeEditOutline size={20} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <RiDeleteBin5Line size={20} />
          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-2">
        Advisor: <span className="font-medium">{section.assignedAdvisor}</span>
      </p>
      <EnrollmentBar
        label="Total"
        enrolled={totalEnrolled}
        capacity={totalCap}
      />
      <div className="mt-2 text-sm text-gray-600">
        <p>CR: {section.crName} ({section.crContact})</p>
        <p>ACR: {section.acrName} ({section.acrContact})</p>
      </div>
      <p className="text-sm text-gray-600 mt-2">
        <span className="font-semibold">{available}</span> seats available | Status:{" "}
        <span className={`font-semibold ${section.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
          {section.status}
        </span>
      </p>
    </div>
  );
};

// Main Section Management Component
const SectionManagementDashboard = () => {
  const axiosSecure = useAxiosSecure();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterSemester, setFilterSemester] = useState('');

  useEffect(() => {
    fetchSections();
  }, [filterSemester]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filterSemester && filterSemester !== 'All Semesters') {
        params.append('semester', filterSemester);
      }

      const response = await axiosSecure.get(`/admin/sections?${params.toString()}`);
      if (response.data.success) {
        setSections(response.data.data || []);
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
    const stats = sections.reduce(
      (acc, s) => {
        acc.totalCapacity += s.totalCapacity || 0;
        acc.enrolledStudents += s.enrolledStudents || 0;
        return acc;
      },
      { totalCapacity: 0, enrolledStudents: 0 }
    );
    return {
      totalSections: sections.length,
      totalCapacity: stats.totalCapacity,
      totalEnrolled: stats.enrolledStudents,
      availableSeats: stats.totalCapacity - stats.enrolledStudents,
    };
  }, [sections]);

  const handleSaveSection = async (sectionData) => {
    try {
      if (sectionData.id) {
        // Update existing section
        const response = await axiosSecure.put(`/admin/sections/${sectionData.id}`, sectionData);
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
        const response = await axiosSecure.post('/admin/sections', sectionData);
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
      const response = await axiosSecure.delete(`/admin/sections/${id}`);
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

  // Get unique semesters from sections
  const semesters = useMemo(() => {
    const semSet = new Set(sections.map(s => s.semester).filter(Boolean));
    return ['All Semesters', ...Array.from(semSet)];
  }, [sections]);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Section Management</h2>
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

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Total Sections" value={metrics.totalSections} />
            <MetricCard title="Total Capacity" value={metrics.totalCapacity} />
            <MetricCard title="Enrolled" value={metrics.totalEnrolled} />
            <MetricCard title="Available Seats" value={metrics.availableSeats} />
          </div>

          {loading ? (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4">Loading sections...</p>
            </div>
          ) : sections.length > 0 ? (
            <div className="space-y-4">
              {sections.map((section) => (
                <SectionCard
                  key={section.id}
                  section={section}
                  onEdit={() => {
                    setEditSection(section);
                    setIsModalOpen(true);
                  }}
                  onDelete={() => setDeleteConfirm(section)}
                />
              ))}
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
          />

          {/* Delete Modal */}
          <DeleteModal
            isOpen={!!deleteConfirm}
            onClose={() => setDeleteConfirm(null)}
            onConfirm={handleDeleteSection}
            section={deleteConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default SectionManagementDashboard;
