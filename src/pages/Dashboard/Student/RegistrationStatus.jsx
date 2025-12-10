import React from "react";
import { useNavigate } from "react-router-dom";
import caplogo from "../../../assets/CAP.png";
import {
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle,
  Bell,
  LogOut,
  Grid,
  Calendar,
  FileText,
  Menu,
  GraduationCap,
  Search,
  Users,
  Check,
  AlertTriangle,
  Plus,
  CircleX,
  Download,
} from "lucide-react";
function RegistrationStatus() {
  const navigate = useNavigate();
  return (
    <>
      {/* Header part */}
      <div className="header flex justify-between items-center px-10 py-2 border-b border-gray-200 fixed  left-0 w-full  bg-white z-10">
        <div
          className="left-part flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div>
            <img src={caplogo} alt="" className="w-14 h-14" />
          </div>
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
            <p className="text-sm font-medium text-gray-900">
              Md. Mohiul Islam Miraz
            </p>
            <p className="text-xs text-gray-500">Student</p>
          </div>
          <button className="relative group p-2 flex items-center justify-center">
            <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />

            <span
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 
               bg-gray-800 text-white text-sm font-semibold py-1 px-2 rounded 
               opacity-0 group-hover:opacity-100 
               transition-opacity duration-200 whitespace-nowrap"
            >
              Logout
            </span>
          </button>
        </div>
      </div>
      {/* body part */}
      <div>
        <aside className="sidebar border-r border-gray-200 p-4 md:w-60 lg:w-64  left-0 fixed top-16 h-[calc(100vh-4rem)] bg-white">
          <nav className="space-y-1 ">
            <a
              href=""
              className="flex items-center gap-3 p-4"
              onClick={() => {
                navigate("/student/dashboard");
              }}
            >
              <Grid className="w-5 h-5" />
              <span>Dashboard</span>
            </a>
            <a
              href=""
              className="flex items-center gap-3 p-4"
              onClick={() => navigate("/student/dashboard/courseselection")}
            >
              <BookOpen className="w-5 h-5" />
              <span> Course Selection</span>
            </a>
            <a
              href=""
              className="flex items-center gap-3 p-4"
              onClick={() => {
                navigate("/student/dashboard/myschedule");
              }}
            >
              <Calendar className="w-5 h-5" />
              <span>My Schedule</span>
            </a>
            <a
              href=""
              className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg"
            >
              <FileText className="w-5 h-5" />
              <span>Registration Status</span>
            </a>
          </nav>
        </aside>
        <main className="ml-64 p-4 md:p-8 lg:p-8 mt-16 flex flex-col gap-6 md:gap-8 lg:gap-6 flex-1 overflow-y-auto bg-gray-50">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">Registration Status</p>
              <p>Track your course Registration approval</p>
            </div>
            <div>
              <button className="flex gap-2 border border-gray-400 py-2 px-3 rounded-lg cursor-pointer font-semibold items-center">
                <Download className="w-5 h-5  cursor-pointer" />
                Export Report
              </button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 items-center mb-6">
            <div className="p-6 flex justify-between border border-gray-300 bg-white rounded-lg items-center">
              <div>
                <p className="text-gray-500">Approved</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            {/* 2nd part*/}
            <div className="p-6 flex justify-between border border-gray-300 bg-white rounded-lg items-center">
              <div>
                <p className="text-gray-500">Pending</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <Clock className="w-6 h-6 text-gray-500" />
            </div>
            {/* 3rd part*/}
            <div className="p-6 flex justify-between border border-gray-300 bg-white rounded-lg items-center">
              <div>
                <p className="text-gray-500">Rejected</p>
                <p className="text-2xl font-bold">1</p>
              </div>
              <CircleX className="w-6 h-6 text-red-600" />
            </div>
          </div>
          {/* course Details */}

          <div className=" p-6 rounded-lg bg-white shadow">
            <div className="mb-6">
              <p className="text-xl font-bold">Course Registration Details</p>
              <p className="text-gray-500">
                View status and feedback for each course
              </p>
            </div>
            <div className="flex md:felx-col lg:flex-col gap-6">
              {/* 1st part*/}
              <div className="border border-gray-300 shadow p-4 rounded-lg bg-white">
                <div className="flex gap-3 items-center">
                  <p className="text-2xl font-bold">CSE-3642</p>
                  <div>
                    <p className="border border-gray-400 rounded-lg p-1 text-sm">
                      1 Credits
                    </p>
                  </div>
                  <div className="bg-green-600 text-white p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <p className="text-sm">Approved</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold  mb-2">
                    Software Engineering lab
                  </p>
                </div>
                <div className="text-gray-600 mb-2 ">
                  <p>Advisor: Ahsanaul Kalam Akib</p>
                  <p>Submited: Feb 28,2025</p>
                  <p>Processed: Mar 1,2025</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg mb-2">
                  <p className="font-semibold">Advisor Feedback:</p>
                  <p className="text-sm text-gray-600 font-medium">
                    Approved. Good luck with your Project!
                  </p>
                </div>
              </div>
              {/* 2nd part*/}
              <div className="border border-gray-300 shadow p-4 rounded-lg bg-white">
                <div className="flex gap-3 items-center">
                  <p className="text-2xl font-bold">CSE-3641</p>
                  <div>
                    <p className="border border-gray-400 rounded-lg p-1 text-sm">
                      3 Credits
                    </p>
                  </div>
                  <div className="bg-green-600 text-white p-2 rounded-lg flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <p className="text-sm">Approved</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold  mb-2">Software Engineering</p>
                </div>
                <div className="text-gray-600 mb-2 ">
                  <p>Advisor: Dr. Rahman</p>
                  <p>Submited: Feb 28,2025</p>
                  <p>Processed: Mar 1,2025</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg mb-2">
                  <p className="font-semibold">Advisor Feedback:</p>
                  <p className="text-sm text-gray-600 font-medium">Approved.</p>
                </div>
              </div>
              {/* 3rd part*/}
              <div className="border border-gray-300 shadow p-4 rounded-lg bg-white">
                <div className="flex gap-3 items-center">
                  <p className="text-2xl font-bold">CSE-3631</p>
                  <div>
                    <p className="border border-gray-400 rounded-lg p-1 text-sm">
                      3 Credits
                    </p>
                  </div>
                  <div className="bg-gray-300  p-2 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <p className="text-sm">Pending</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold  mb-2">Database Systems</p>
                </div>
                <div className="text-gray-600 mb-2 ">
                  <p>Advisor: Ahsanaul Kalam Akib</p>
                  <p>Submited: Mar 2,2025</p>
                </div>
              </div>
              {/* 4th part*/}
              <div className="border border-gray-300 shadow p-4 rounded-lg bg-white">
                <div className="flex gap-3 items-center">
                  <p className="text-2xl font-bold">CSE-3621</p>
                  <div>
                    <p className="border border-gray-400 rounded-lg p-1 text-sm">
                      3 Credits
                    </p>
                  </div>
                  <div className="bg-red-600 text-white p-2 rounded-lg flex items-center gap-2">
                    <CircleX className="w-4 h-4 " />
                    <p className="text-sm">Rejected</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold  mb-2">Operating Systems</p>
                </div>
                <div className="text-gray-600 mb-2 ">
                  <p>Advisor: Dr. Khan</p>
                  <p>Submited: Feb 25,2025</p>
                  <p>Processed: Feb 26,2025</p>
                </div>
                <div className="bg-gray-200 p-2 rounded-lg mb-2">
                  <p className="font-semibold">Advisor Feedback:</p>
                  <p className="text-sm text-gray-600 font-medium">
                    Prerequisites not met. Please complete CSE-2611 forst.
                  </p>
                </div>
              </div>
              {/* 5th part*/}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default RegistrationStatus;
