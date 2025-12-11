import React, { useState, useMemo } from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import { MdOutlineModeEditOutline } from "react-icons/md";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";


// --- Dummy Section Data ---
const initialSections = [
  { id: 1, name: "6EM", semester: 6, shift: "Male", advisor: "Jamil Asad", regCap: 42, regEnroll: 40, irregCap: 8, irregEnroll: 5, status: "Active" },
  { id: 2, name: "6CM", semester: 6, shift: "Male", advisor: "Bodiuzzaman Biplop", regCap: 45, regEnroll: 43, irregCap: 5, irregEnroll: 4, status: "Active" },
  { id: 3, name: "5DM", semester: 5, shift: "Male", advisor: "Dr. Rahman", regCap: 42, regEnroll: 38, irregCap: 8, irregEnroll: 6, status: "Inactive" },
  { id: 4, name: "1AM", semester: 1, shift: "Female", advisor: "Dr. Ahmed", regCap: 46, regEnroll: 45, irregCap: 2, irregEnroll: 0, status: "Active" },
];

// --- Enrollment Bar ---
const EnrollmentBar = ({ enrolled, capacity, label }) => {
  const available = capacity - enrolled;
  const percentage = (enrolled / capacity) * 100;

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

// --- Add/Edit Modal ---
const SectionModal = ({ isOpen, onClose, onSave, section }) => {
  const isEditing = !!section;
  const [formData, setFormData] = useState(
    section || {
      name: "",
      advisor: "",
      semester: 1,
      regCap: 40,
      irregCap: 5,
      regEnroll: 0,
      irregEnroll: 0,
      shift: "Male",
      status: "Active",
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
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Section Name (e.g., 6EM)"
            className="w-full border p-3 rounded-lg"
            required
          />
          <input
            type="text"
            name="advisor"
            value={formData.advisor}
            onChange={handleChange}
            placeholder="Advisor Name"
            className="w-full border p-3 rounded-lg"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="regCap"
              value={formData.regCap}
              onChange={handleChange}
              placeholder="Regular Capacity"
              className="w-full border p-3 rounded-lg"
              required
            />
            <input
              type="number"
              name="regEnroll"
              value={formData.regEnroll}
              onChange={handleChange}
              placeholder="Regular Enrolled"
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              name="irregCap"
              value={formData.irregCap}
              onChange={handleChange}
              placeholder="Irregular Capacity"
              className="w-full border p-3 rounded-lg"
              required
            />
            <input
              type="number"
              name="irregEnroll"
              value={formData.irregEnroll}
              onChange={handleChange}
              placeholder="Irregular Enrolled"
              className="w-full border p-3 rounded-lg"
              required
            />
          </div>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
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

// --- Delete Confirmation Modal ---
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
          <span className="font-semibold">{section?.name}</span>? This action
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

// --- Section Management Dashboard ---
const SectionManagementDashboard = () => {
  const [sections, setSections] = useState(initialSections);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editSection, setEditSection] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const metrics = useMemo(() => {
    const totalCapacity = sections.reduce(
      (sum, s) => sum + s.regCap + s.irregCap,
      0
    );
    const totalEnrolled = sections.reduce(
      (sum, s) => sum + s.regEnroll + s.irregEnroll,
      0
    );
    return {
      totalSections: sections.length,
      totalCapacity,
      totalEnrolled,
      availableSeats: totalCapacity - totalEnrolled,
    };
  }, [sections]);

  const handleSaveSection = (sectionData) => {
    if (sectionData.id) {
      setSections((prev) =>
        prev.map((s) => (s.id === sectionData.id ? sectionData : s))
      );
    } else {
      setSections((prev) => [
        ...prev,
        { ...sectionData, id: Date.now(), semester: 1 },
      ]);
    }
  };

  const handleDeleteSection = (id) => {
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

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

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Sections" value={metrics.totalSections} />
        <MetricCard title="Total Capacity" value={metrics.totalCapacity} />
        <MetricCard title="Enrolled" value={metrics.totalEnrolled} />
        <MetricCard title="Available Seats" value={metrics.availableSeats} />
      </div>

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

      {/* Add/Edit Modal */}
      <SectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

// --- Subcomponents ---
const MetricCard = ({ title, value }) => (
  <div className="bg-white p-5 rounded-xl shadow-md">
    <h4 className="text-sm text-gray-500">{title}</h4>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const SectionCard = ({ section, onEdit, onDelete }) => {
  const totalCap = section.regCap + section.irregCap;
  const totalEnrolled = section.regEnroll + section.irregEnroll;
  const available = totalCap - totalEnrolled;

  return (
    <div className="bg-white p-5 rounded-xl shadow-md border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold">{section.name}</h3>
        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Edit"
          >
            <MdOutlineModeEditOutline />

          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800"
            title="Delete"
          >
            <RiDeleteBin5Line />

          </button>
        </div>
      </div>
      <p className="text-gray-600 mb-2">
        Advisor: <span className="font-medium">{section.advisor}</span>
      </p>
      <EnrollmentBar
        label="Regular"
        enrolled={section.regEnroll}
        capacity={section.regCap}
      />
      <EnrollmentBar
        label="Irregular"
        enrolled={section.irregEnroll}
        capacity={section.irregCap}
      />
      <p className="text-sm text-gray-600 mt-2">
        <span className="font-semibold">{available}</span> seats available
      </p>
    </div>
  );
};

export default SectionManagementDashboard;
