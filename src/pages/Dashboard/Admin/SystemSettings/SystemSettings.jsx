import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Bell, LogOut, Menu } from "lucide-react";
import AdminSidebar from "../../../../Components/AdminSidebar/AdminSidebar";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useUserRole from "../../../../hooks/useUserRole/useUserRole";
import { getSystemSettings, updateSystemSettings } from "../../../../api/adminApi";
import Loader from "../../../../Components/shared/Loader/Loader";

const SystemSettings = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const { role } = useUserRole();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [registrationEnabled, setRegistrationEnabled] = useState(false);
  const [registrationStartDate, setRegistrationStartDate] = useState('');
  const [registrationEndDate, setRegistrationEndDate] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await getSystemSettings();
      const data = response.data.data;
      
      setRegistrationEnabled(data.registrationPeriod?.enabled || false);
      setRegistrationStartDate(
        data.registrationPeriod?.startDate 
          ? new Date(data.registrationPeriod.startDate).toISOString().split('T')[0] 
          : ''
      );
      setRegistrationEndDate(
        data.registrationPeriod?.endDate 
          ? new Date(data.registrationPeriod.endDate).toISOString().split('T')[0] 
          : ''
      );
      
      setLoading(false);
    } catch (err) {
      console.error('Error loading settings:', err);
      setError('Failed to load system settings');
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMessage(null);

      if (registrationEnabled && registrationStartDate && registrationEndDate) {
        const start = new Date(registrationStartDate);
        const end = new Date(registrationEndDate);
        if (start >= end) {
          setError('Registration start date must be before end date');
          setSaving(false);
          return;
        }
      }

      const payload = {
        registrationPeriod: {
          enabled: registrationEnabled,
          startDate: registrationStartDate || null,
          endDate: registrationEndDate || null,
        }
      };

      await updateSystemSettings(payload);
      setSuccessMessage('Settings saved successfully!');
      setSaving(false);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.response?.data?.message || 'Failed to save settings');
      setSaving(false);
    }
  };

  const renderContent = () => {
    return (
      <>
        <h3 className="text-lg font-semibold mb-2">Registration Period</h3>
        <p className="text-gray-500 mb-6 text-sm">Configure course registration period</p>
        
        {/* Registration Period Settings */}
        <div className="space-y-6">
          {/* Enable Registration Period Toggle */}
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enable Registration Period Restriction
              </label>
              <p className="text-sm text-gray-500">
                Restrict course registration to a specific time period
              </p>
            </div>
            <button 
              onClick={() => setRegistrationEnabled(!registrationEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${registrationEnabled ? 'bg-blue-600' : 'bg-gray-200'}`}
              aria-checked={registrationEnabled}
              role="switch"
            >
              <span 
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${registrationEnabled ? 'translate-x-6' : 'translate-x-1'}`}
              />
            </button>
          </div>

          {/* Date Inputs */}
          <div className={`space-y-4 ${!registrationEnabled ? 'opacity-50' : ''}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Start Date
              </label>
              <input
                type="date"
                value={registrationStartDate}
                onChange={(e) => setRegistrationStartDate(e.target.value)}
                disabled={!registrationEnabled}
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration End Date
              </label>
              <input
                type="date"
                value={registrationEndDate}
                onChange={(e) => setRegistrationEndDate(e.target.value)}
                disabled={!registrationEnabled}
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {/* Info Box */}
          {registrationEnabled && registrationStartDate && registrationEndDate && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Registration Period:</strong> Students will only be able to select and register for courses between{' '}
                <strong>{new Date(registrationStartDate).toLocaleDateString()}</strong> and{' '}
                <strong>{new Date(registrationEndDate).toLocaleDateString()}</strong>.
              </p>
            </div>
          )}
        </div>
      </>
    );
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

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto flex items-center justify-center">
          <Loader />
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-10">
          <h1 className="text-3xl font-bold text-gray-900">Registration Period Settings</h1>
          <p className="text-gray-500 mb-6">Configure when students can register for courses</p>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
              {successMessage}
            </div>
          )}
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          {/* Settings Card/Container */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            {renderContent()}
          </div>

          {/* Save Settings Button */}
          <div className="flex justify-end mt-6">
            <button 
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center bg-blue-600 text-white font-medium py-2 px-4 rounded-md shadow-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <span className="ml-2">Save Settings</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SystemSettings;
