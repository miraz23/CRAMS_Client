import React, { useState, useEffect } from 'react';
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import {
  getUserOverview,
  listStudents,
  listTeachers,
  listStaff,
  listAdmins,
  updateStudent,
  updateTeacher,
  updateStaff,
  updateAdmin,
  deleteStudent,
  deleteTeacher,
  deleteStaff,
  deleteAdmin,
} from "../../../../api/adminApi";
import Swal from "sweetalert2";
import useUserRole from "../../../../hooks/useUserRole/useUserRole";

// Stat Card Component
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

// Status Tag Component
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

// Edit Modal Component
const EditModal = ({ user, userType, onClose, onSave, isSuperAdmin }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSave(formData);
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit {userType} Info</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {userType === 'Student' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {userType === 'Teacher' && isSuperAdmin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                <input
                  type="text"
                  name="teacherId"
                  value={formData.teacherId || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privilege</label>
                <select
                  name="privilege"
                  value={formData.privilege || 'Teacher'}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Teacher">Teacher</option>
                  <option value="Advisor">Advisor</option>
                </select>
              </div>
            </>
          )}

          {userType === 'Advisor' && isSuperAdmin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teacher ID</label>
                <input
                  type="text"
                  name="teacherId"
                  value={formData.teacherId || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Privilege</label>
                <select
                  name="privilege"
                  value={formData.privilege || 'Advisor'}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="Advisor">Advisor</option>
                  <option value="Teacher">Teacher</option>
                </select>
              </div>
            </>
          )}

          {userType === 'Staff' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                <input
                  type="text"
                  name="staffId"
                  value={formData.staffId || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {isSuperAdmin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Privilege</label>
                  <select
                    name="privilege"
                    value={formData.privilege || 'Staff'}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              )}
            </>
          )}

          {userType === 'Admin' && isSuperAdmin && (
            <>
              {formData.staffId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Staff ID</label>
                    <input
                      type="text"
                      name="staffId"
                      value={formData.staffId || ''}
                      disabled
                      className="w-full border border-gray-300 rounded-md p-2 bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formData.designation || ''}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Privilege</label>
                    <select
                      name="privilege"
                      value={formData.privilege || 'Admin'}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                </>
              )}
              {!formData.staffId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Privilege</label>
                    <select
                      name="privilege"
                      value={formData.privilege || 'Admin'}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Admin">Admin</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                </>
              )}
            </>
          )}

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

// Main User Management Component
const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('Students');
  const [searchTerm, setSearchTerm] = useState('');
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [staffs, setStaffs] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalStaffs: 0,
  });
  const { role } = useUserRole();
  const isSuperAdmin = role === 'super admin';
  const isAdmin = role === 'admin' || role === 'super admin';
  const getEntityLabel = () => {
    if (activeTab === 'Staff') return 'Staff';
    if (activeTab === 'Admins') return 'Admin';
    return activeTab.slice(0, -1);
  };

  useEffect(() => {
    fetchUserOverviewData();
  }, []);

  useEffect(() => {
    if (activeTab === 'Students') {
      fetchStudents();
    } else if (activeTab === 'Teachers') {
      fetchTeachers();
    } else if (activeTab === 'Advisors') {
      fetchTeachers();
    } else if (activeTab === 'Staff') {
      fetchStaffs();
    } else if (activeTab === 'Admins' && isSuperAdmin) {
      fetchAdmins();
    }
  }, [activeTab, isSuperAdmin]);

  const fetchUserOverviewData = async () => {
    try {
      const response = await getUserOverview();
      if (response.data.success) {
        const data = response.data.data;
        setStats({
          totalStudents: data.totals?.totalStudents || 0,
          totalTeachers: data.totals?.totalTeachers || 0,
          totalStaffs: data.totals?.totalStaffs || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user overview:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await listStudents();
      if (response.data.success) {
        setStudents(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load students",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await listAdmins();
      if (response.data.success) {
        setAdmins(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching admins:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load admins",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await listTeachers();
      if (response.data.success) {
        setTeachers(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load teachers",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffs = async () => {
    try {
      setLoading(true);
      const response = await listStaff();
      if (response.data.success) {
        setStaffs(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching staffs:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load staff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    if (!isSuperAdmin) return;
    setEditingUser(user);
  };

  const handleSave = async (updatedUser) => {
    if (!isSuperAdmin) {
      Swal.fire({
        icon: "info",
        title: "Super Admin required",
        text: "Only a Super Admin can update user details.",
      });
      return;
    }
    try {
      let response;
      if (activeTab === 'Students') {
        response = await updateStudent(updatedUser.id, updatedUser);
      } else if (activeTab === 'Teachers') {
        response = await updateTeacher(updatedUser.id, updatedUser);
      } else if (activeTab === 'Staff') {
        response = await updateStaff(updatedUser.id, updatedUser);
      } else if (activeTab === 'Advisors') {
        response = await updateTeacher(updatedUser.id, { ...updatedUser, privilege: 'Advisor' });
      } else if (activeTab === 'Admins') {
        // Check if it's a staff-admin or regular admin
        if (updatedUser.source === 'Staff') {
          // Update via staff endpoint
          response = await updateStaff(updatedUser.id, updatedUser);
        } else {
          // Update via admin endpoint
          response = await updateAdmin(updatedUser.id, updatedUser);
        }
      }
      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: `${getEntityLabel()} updated successfully`,
          timer: 1500,
        });
        
        // Refresh the current tab
        if (activeTab === 'Students') {
          fetchStudents();
        } else if (activeTab === 'Teachers') {
          fetchTeachers();
        } else if (activeTab === 'Staff') {
          fetchStaffs();
          // If updating staff privilege to Admin, refresh admins list
          if (updatedUser.privilege === 'Admin') {
            fetchAdmins();
          }
        } else if (activeTab === 'Advisors') {
          fetchTeachers();
        } else if (activeTab === 'Admins') {
          fetchAdmins();
          // Also refresh staff list if the admin was converted from staff
          if (updatedUser.source === 'Staff') {
            fetchStaffs();
          }
        }
        
        setEditingUser(null);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to update user",
      });
    }
  };

  const handleRemove = async (user) => {
    // Check permissions
    if (activeTab === 'Advisors' && !isAdmin) {
      // Only Admin or Super Admin can remove advisors
      return;
    }
    if (activeTab === 'Admins' && !isSuperAdmin) {
      // Only Super Admin can remove admins
      return;
    }

    const entity = activeTab === 'Advisors' ? 'Advisor' : 'Admin';
    const newPrivilege = activeTab === 'Advisors' ? 'Teacher' : 'Staff';
    const confirmation = await Swal.fire({
      icon: "warning",
      title: `Remove ${entity} Privilege?`,
      text: `This will change ${user.name}'s privilege from ${entity} to ${newPrivilege}.`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Remove",
    });

    if (!confirmation.isConfirmed) return;

    try {
      let response;
      if (activeTab === 'Advisors') {
        // Change Advisor back to Teacher
        response = await updateTeacher(user.id, { ...user, privilege: 'Teacher' });
      } else if (activeTab === 'Admins') {
        // Change Admin back to Staff
        if (user.source === 'Staff') {
          // Update via staff endpoint
          response = await updateStaff(user.id, { ...user, privilege: 'Staff' });
        } else {
          // Regular admin - cannot be removed (only staff-admins can be removed)
          Swal.fire({
            icon: "info",
            title: "Cannot Remove",
            text: "Only staff members promoted to Admin can be removed.",
          });
          return;
        }
      }

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Privilege Removed",
          text: `${user.name} is now a ${newPrivilege}.`,
          timer: 1500,
        });

        // Refresh the lists
        if (activeTab === 'Advisors') {
          fetchTeachers();
        } else if (activeTab === 'Admins') {
          fetchAdmins();
          fetchStaffs(); // Refresh staff list since admin was converted back
        }
      }
    } catch (error) {
      console.error('Error removing privilege:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to remove privilege",
      });
    }
  };

  const handleDelete = async (user) => {
    if (!isSuperAdmin) return;

    const entity = getEntityLabel();
    const confirmation = await Swal.fire({
      icon: "warning",
      title: `Delete ${entity}?`,
      text: `This will permanently remove the ${entity.toLowerCase()}.`,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (!confirmation.isConfirmed) return;

    try {
      let response;
      if (activeTab === 'Students') {
        response = await deleteStudent(user.id);
      } else if (activeTab === 'Teachers') {
        response = await deleteTeacher(user.id);
      } else if (activeTab === 'Advisors') {
        response = await deleteTeacher(user.id);
      } else if (activeTab === 'Staff') {
        response = await deleteStaff(user.id);
      } else if (activeTab === 'Admins') {
        // Check if it's a staff-admin or regular admin
        if (user.source === 'Staff') {
          // Delete via staff endpoint
          response = await deleteStaff(user.id);
        } else {
          // Delete via admin endpoint
          response = await deleteAdmin(user.id);
        }
      } else {
        response = { data: { success: false } };
      }

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: `${entity} deleted`,
          timer: 1200,
          showConfirmButton: false,
        });

        if (activeTab === 'Students') {
          fetchStudents();
        } else if (activeTab === 'Teachers') {
          fetchTeachers();
        } else if (activeTab === 'Advisors') {
          fetchTeachers();
        } else if (activeTab === 'Staff') {
          fetchStaffs();
        } else if (activeTab === 'Admins') {
          fetchAdmins();
          // Also refresh staff list if the deleted admin was from staff
          if (user.source === 'Staff') {
            fetchStaffs();
          }
        }
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to delete user",
      });
    }
  };

  const getFilteredUsers = () => {
    let users = [];
    if (activeTab === 'Students') {
      users = students;
    } else if (activeTab === 'Teachers') {
      // Show all teachers including those with Advisor privilege
      users = teachers;
    } else if (activeTab === 'Advisors') {
      users = teachers.filter(t => (t.privilege || '').toLowerCase() === 'advisor');
    } else if (activeTab === 'Staff') {
      users = staffs;
    } else if (activeTab === 'Admins') {
      users = admins;
    }

    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      return users.filter(user =>
        (user.name || '').toLowerCase().includes(lowerSearchTerm) ||
        (user.studentId || user.teacherId || user.staffId || '').toLowerCase().includes(lowerSearchTerm) ||
        (user.email || '').toLowerCase().includes(lowerSearchTerm)
      );
    }
    return users;
  };

  const filteredUsers = getFilteredUsers();
  const advisorsCount = teachers.filter(t => (t.privilege || '').toLowerCase() === 'advisor').length;
  const teacherCount = teachers.length; // include advisors in teacher bucket

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-500 mb-6">Manage students, teachers, and staff</p>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard title="Total Students" count={stats.totalStudents} icon="Users" />
            <StatCard title="Total Teachers" count={teacherCount} icon="Advisors" />
            <StatCard title="Total Advisors" count={advisorsCount} icon="Users" />
            <StatCard title="Total Staff" count={stats.totalStaffs} icon="Users" />
            {isSuperAdmin && (
              <StatCard title="Total Admins" count={admins.length} icon="Users" />
            )}
          </div>

          {/* Search */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Search Users</h3>
            <input
              type="text"
              placeholder="🔎 Search by name, ID, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 flex-wrap">
            {(() => {
              const baseTabs = [
                { label: `Students (${stats.totalStudents})`, value: 'Students' },
                { label: `Teachers (${teacherCount})`, value: 'Teachers' },
                { label: `Advisors (${advisorsCount})`, value: 'Advisors' },
                { label: `Staff (${stats.totalStaffs})`, value: 'Staff' },
              ];
              const tabs = isSuperAdmin
                ? [...baseTabs, { label: `Admins (${admins.length})`, value: 'Admins' }]
                : baseTabs;
              return tabs.map(({ label, value }) => (
                <button
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={`py-2 px-4 text-sm font-medium transition-colors ${
                    activeTab === value
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ));
            })()}
          </div>

          {/* User List */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">
              {activeTab} Accounts
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              Manage {activeTab.toLowerCase()} user accounts and permissions
            </p>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <p className="text-base font-medium text-gray-900 mr-3">{user.name}</p>
                        <StatusTag type="active">Active</StatusTag>
                        {user.department && <StatusTag type="type">{user.department}</StatusTag>}
                      </div>
                      <div className="text-sm text-gray-500 space-x-4 mt-1">
                        <span className="inline-block">
                          ID: {user.studentId || user.teacherId || user.staffId || 'N/A'}
                        </span>
                        <span className="inline-block text-blue-600">{user.email}</span>
                        {user.designation && (
                          <span className="inline-block">Designation: {user.designation}</span>
                        )}
                        {user.privilege && (
                          <span className="inline-block">Privilege: {user.privilege}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      {/* Remove button for Advisors and Admins */}
                      {((activeTab === 'Advisors' && isAdmin) || 
                        (activeTab === 'Admins' && isSuperAdmin && user.source === 'Staff')) && (
                        <button
                          onClick={() => handleRemove(user)}
                          className="text-sm text-orange-700 px-3 py-1 border border-orange-300 rounded-md hover:bg-orange-50 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      {isSuperAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-sm text-gray-700 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="text-sm text-red-700 px-3 py-1 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 p-4">
                No {activeTab.toLowerCase()} found matching your search term.
              </p>
            )}
          </div>

          {/* Edit Modal */}
          {editingUser && (
            <EditModal
              user={editingUser}
              userType={getEntityLabel()}
              onClose={() => setEditingUser(null)}
              onSave={handleSave}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
