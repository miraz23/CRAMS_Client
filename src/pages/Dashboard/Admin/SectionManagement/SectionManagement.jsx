import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Bell, LogOut, Menu } from "lucide-react";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import { listSections, createSection, updateSection, deleteSection, listAdvisors } from "../../../../api/adminApi";
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
      setFormData({
        ...section,
      });
    } else {
      setFormData({
        sectionName: "",
        semester: "",
        assignedAdvisor: "",
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Students</label>
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
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Menu className="w-6 h-6 text-gray-600 lg:hidden" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {role === "super admin" ? "Super Admin" : "Admin"}
                  </p>
                  <p className="text-xs text-gray-500">Section Management</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative group p-2 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
                </button>
              </div>
            </div>
          </div>
        </div>

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
                      <tr key={section.id} className="hover:bg-gray-50">
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
                          <div className="flex gap-3">
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
        </div>
      </div>
    </div>
  );
};

export default SectionManagementDashboard;
