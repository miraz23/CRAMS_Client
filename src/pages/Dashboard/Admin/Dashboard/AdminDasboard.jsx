import React from "react";
import { BiBookOpen, BiTrendingUp, BiUserCheck } from "react-icons/bi";
import { FaUserSecret } from "react-icons/fa";
import { FaCircleDot } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">System Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Monitor and manage the CRAMS platform
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                Total Courses
              </h3>
              {/* <p className="text-3xl font-semibold mt-2 text-gray-800">156</p> */}
              {/* <span className="text-green-600 text-sm font-medium mt-1 inline-block">
                +12
              </span> */}
            </div>
            <div className="bg-blue-50 p-4 rounded-full">
              <BiBookOpen className="text-blue-600" size={30} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                Active Students
              </h3>
              {/* <p className="text-3xl font-semibold mt-2 text-gray-800">1,234</p> */}
              {/* <span className="text-green-600 text-sm font-medium mt-1 inline-block">
                +45
              </span> */}
            </div>
            <div className="bg-green-50 p-4 rounded-full">
              <FaUserSecret className="text-green-600" size={30} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                Total Advisors
              </h3>
              {/* <p className="text-3xl font-semibold mt-2 text-gray-800">28</p> */}
              {/* <span className="text-green-600 text-sm font-medium mt-1 inline-block">
                +2
              </span> */}
            </div>
            <div className="bg-purple-50 p-4 rounded-full">
              <BiUserCheck className="text-purple-600" size={30} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm text-gray-500 font-medium">
                Registrations
              </h3>
              {/* <p className="text-3xl font-semibold mt-2 text-gray-800">892</p> */}
              {/* <span className="text-green-600 text-sm font-medium mt-1 inline-block">
                +156
              </span> */}
            </div>
            <div className="bg-teal-50 p-4 rounded-full">
              <BiTrendingUp className="text-teal-600" size={30} />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Alerts */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            System Alerts
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Important notifications
          </p>
          <div className="space-y-3">
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-3 flex items-start gap-3">
              <FiAlertCircle className="text-blue-600 mt-0.5" size={18} />
              {/* <span className="text-gray-700 text-sm">
                CSE-3661 AI course has only 3 seats remaining
              </span> */}
            </div>
            <div className="border border-yellow-200 bg-yellow-50 rounded-lg p-3 flex items-start gap-3">
              <FiAlertCircle className="text-yellow-600 mt-0.5" size={18} />
              {/* <span className="text-gray-700 text-sm">
                Registration deadline is in 5 days
              </span> */}
            </div>
            <div className="border border-red-200 bg-red-50 rounded-lg p-3 flex items-start gap-3">
              <FiAlertCircle className="text-red-600 mt-0.5" size={18} />
              {/* <span className="text-gray-700 text-sm">
                12 students pending advisor assignment
              </span> */}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-gray-100 transition">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Recent Activity
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Latest system events and changes
          </p>
          <div className="space-y-5 text-sm">
            <div>
              <p className="font-medium text-blue-600 flex items-center gap-1">
                <FaCircleDot size={10} /> New course added
              </p>
              {/* <p className="text-gray-700">CSE-4641 Machine Learning</p> */}
              {/* <p className="text-gray-400 text-xs">5 minutes ago</p> */}
            </div>
            <div>
              <p className="font-medium text-blue-600 flex items-center gap-1">
                <FaCircleDot size={10} /> User registered
              </p>
              {/* <p className="text-gray-700">Student C231300</p> */}
              {/* <p className="text-gray-400 text-xs">12 minutes ago</p> */}
            </div>
            <div>
              <p className="font-medium text-blue-600 flex items-center gap-1">
                <FaCircleDot size={10} /> Course updated
              </p>
              {/* <p className="text-gray-700">
                CSE-3631 seat capacity changed
              </p> */}
              {/* <p className="text-gray-400 text-xs">1 hour ago</p> */}
            </div>
            <div>
              <p className="font-medium text-blue-600 flex items-center gap-1">
                <FaCircleDot size={10} /> Advisor assigned
              </p>
              <p className="text-gray-700">
                Ahsanul Kalam Akib assigned to 15 students
              </p>
              <p className="text-gray-400 text-xs">2 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
