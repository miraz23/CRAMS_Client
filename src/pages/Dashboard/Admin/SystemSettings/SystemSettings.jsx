import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useUserRole from "../../../../hooks/useUserRole/useUserRole";

// NOTE: You would typically pass the active page and user info via props/context.
// For this standalone component, we'll hardcode some data and state.

const SystemSettings = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { role } = useUserRole();
  // Mock state for the active tab and the Maintenance Mode toggle
  const [activeTab, setActiveTab] = useState('General');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Mock data for the navigation (Sidebar)
  // const navItems = [
  //   { name: 'Dashboard', icon: 'LayoutDashboard', active: false },
  //   { name: 'Course Management', icon: 'BookOpen', active: false },
  //   { name: 'Section Management', icon: 'Users', active: false },
  //   { name: 'User Management', icon: 'User', active: false },
  //   { name: 'System Settings', icon: 'Settings', active: true },
  // ];

  // Mock data for the General Settings fields
  const generalSettings = [
    { label: 'University Name', value: 'International Islamic University Chittagong' },
    { label: 'Current Semester', value: 'Spring 2025' },
    { label: 'System Email', value: 'crams@iiuc.ac.bd' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'General':
        return (
          <>
            <h3 className="text-lg font-semibold mb-2">General Settings</h3>
            <p className="text-gray-500 mb-6 text-sm">Basic system configuration</p>
            
            {/* Input Fields Container */}
            <div className="space-y-6">
              {generalSettings.map((setting) => (
                <div key={setting.label}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {setting.label}
                  </label>
                  <input
                    type="text"
                    value={setting.value}
                    readOnly
                    // You'll need styling here to match the look (e.g., border, padding)
                    className="w-full p-2 border border-gray-300 rounded-md bg-white"
                  />
                </div>
              ))}

              {/* Maintenance Mode Toggle */}
              <div className="flex justify-between items-center pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Maintenance Mode
                  </label>
                  <p className="text-sm text-gray-500">
                    Temporarily disable student access
                  </p>
                </div>
                {/* Toggle Switch Placeholder - Replace with a proper switch component */}
                <button 
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${maintenanceMode ? 'bg-blue-600' : 'bg-gray-200'}`}
                  aria-checked={maintenanceMode}
                  role="switch"
                >
                  <span 
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'}`}
                  />
                </button>
              </div>
            </div>
          </>
        );
      case 'Registration':
        return <p>Registration Settings content would go here.</p>;
      case 'Notifications':
        return <p>Notifications Settings content would go here.</p>;
      default:
        return null;
    }
  };

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
      <main className="flex-1 overflow-y-auto">
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
                  <p className="text-xs text-gray-500">System Settings</p>
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

        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
          <p className="text-gray-500 mb-6">Configure system-wide settings and preferences</p>

          {/* Settings Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-4" aria-label="Tabs">
              {['General', 'Registration', 'Notifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  // Styling the active tab with a blue underline/border
                  className={`py-2 px-1 text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Settings Card/Container */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {renderContent()}
          </div>

          {/* Save Settings Button - Fixed to bottom right in the image */}
          {/* Note: In a real app, this would likely be outside the main content card */}
          <div className="flex justify-end mt-6">
            <button 
              className="flex items-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition-colors"
            >
              {/* Save Icon Placeholder */}
              💾
              <span className="ml-2">Save Settings</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettings;