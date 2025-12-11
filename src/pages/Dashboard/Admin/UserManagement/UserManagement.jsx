import React, { useState } from 'react';
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";


// Stat Card (unchanged)
const StatCard = ({ title, count, icon }) => (
  <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800 mt-1">{count}</h2>
    </div>
    <span className={`text-4xl ${icon === 'Users' ? 'text-blue-500' : 'text-green-500'}`}>
      {icon === 'Users' ? '👥' : '🛡️'}
    </span>
  </div>
);

// Status Tag
const StatusTag = ({ children, type }) => {
  const baseClasses = "text-xs font-semibold px-2 py-0.5 rounded-full mr-2";
  let colorClasses = "";
  switch (type) {
    case 'active': colorClasses = 'bg-green-100 text-green-700'; break;
    case 'sem': colorClasses = 'bg-yellow-100 text-yellow-700'; break;
    case 'type': colorClasses = 'bg-blue-100 text-blue-700'; break;
    default: colorClasses = 'bg-gray-100 text-gray-700';
  }
  return <span className={`${baseClasses} ${colorClasses}`}>{children}</span>;
};

// Mock Data
const mockStudents = [
  { name: 'Md. Mohiul Islam Miraz', id: 'C231197', email: 'miraz@student.iiuc.ac.bd', status: 'active', sem: '6EM', type: 'Regular', cgpa: '3.75' },
  { name: 'Mohammad Moaz', id: 'C231187', email: 'moaz@student.iiuc.ac.bd', status: 'active', sem: '6EM', type: 'Regular', cgpa: '3.45' },
  { name: 'Junaid Mahmud', id: 'C231189', email: 'junaid@student.iiuc.ac.bd', status: 'active', sem: '6CM', type: 'Regular', cgpa: '3.62' },
  { name: 'MD. Ashfaqur Rashid', id: 'C231261', email: 'ashfaq@student.iiuc.ac.bd', status: 'active', sem: '5DM', type: 'Irregular', cgpa: '3.58' },
  { name: 'S.M. Asfaqur Rahman', id: 'C231272', email: 'asfaq@student.iiuc.ac.bd', status: 'active', sem: '6EM', type: 'Regular', cgpa: '3.71' },
];

// --- Edit Modal Component ---
const EditModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState(user);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  return (
    // Background changed: no black, just blur
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
      {/* Modal Card */}
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Student Info</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (readonly) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              disabled
              className="w-full border border-gray-300 rounded-md p-2 bg-gray-100 text-gray-500"
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
            <input
              type="text"
              name="sem"
              value={formData.sem}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. 6EM, 5DM"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Regular">Regular</option>
              <option value="Irregular">Irregular</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Component ---
const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('Students');
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState(mockStudents);
  const [editingUser, setEditingUser] = useState(null);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    const filtered = mockStudents.filter(user =>
      user.name.toLowerCase().includes(term.toLowerCase()) ||
      user.id.toLowerCase().includes(term.toLowerCase()) ||
      user.email.toLowerCase().includes(term.toLowerCase())
    );
    setUsers(filtered);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleSave = (updatedUser) => {
    const updatedList = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updatedList);
    setEditingUser(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
        <button className="flex items-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition-colors">
          <span className="text-xl mr-2">+</span> Add User
        </button>
      </div>
      <p className="text-gray-500 mb-6">Manage students, advisors, and administrators</p>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Students" count="5" icon="Users" />
        <StatCard title="Total Advisors" count="4" icon="Advisors" />
        <StatCard title="Active Users" count="9" icon="Users" />
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Search Users</h3>
        <input
          type="text"
          placeholder="🔎 Search by name, ID, or email..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {['Students (5)', 'Advisors (4)'].map((tab) => {
          const tabName = tab.split(' ')[0];
          return (
            <button
              key={tabName}
              onClick={() => setActiveTab(tabName)}
              className={`py-2 px-4 text-sm font-medium transition-colors ${
                activeTab === tabName
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* User List */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800">Student Accounts</h3>
        <p className="text-gray-500 mb-6 text-sm">Manage student user accounts and permissions</p>

        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <div key={user.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-base font-medium text-gray-900 mr-3">{user.name}</p>
                    <StatusTag type="active">{user.status}</StatusTag>
                    <StatusTag type="sem">{user.sem}</StatusTag>
                    <StatusTag type="type">{user.type}</StatusTag>
                  </div>
                  <div className="text-sm text-gray-500 space-x-4 mt-1">
                    <span className="inline-block">ID: {user.id}</span>
                    <span className="inline-block text-blue-600">{user.email}</span>
                    <span className="inline-block">CGPA: {user.cgpa}</span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-sm text-gray-700 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => alert(`Viewing details for ${user.name}`)}
                    className="text-sm text-gray-700 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 p-4">No users found matching your search term.</p>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <EditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSave}
        />
      )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
