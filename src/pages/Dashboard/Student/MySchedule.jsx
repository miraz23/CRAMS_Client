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
} from "lucide-react";
function MySchedule() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex flex-col h-screen">
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
        <div className="flex flex-1 bg-gray-50">
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
                className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg"
              >
                <Calendar className="w-5 h-5" />
                <span>My Schedule</span>
              </a>
              <a
                href=""
                className="flex items-center gap-3 p-4"
                onClick={() => {
                  navigate("/student/dashboard/registrationstatus");
                }}
              >
                <FileText className="w-5 h-5" />
                <span>Registration Status</span>
              </a>
            </nav>
          </aside>
          <main className="ml-64 p-4 md:p-8 lg:p-8 mt-16 flex flex-col gap-6 md:gap-8 lg:gap-6 flex-1 overflow-y-auto bg-gray-50">
            <div>
              <p className="text-3xl font-bold mb-1">My Schedule</p>
              <p className="text-lg text-gray-500">
                Your weekly class schedule for Spring 2025
              </p>
            </div>
            <div className="border border-gray-300 p-6 py-8 rounded-lg bg-white ">
              <div>
                <p className="text-lg font-semibold">Weekly Schedule</p>
                <p className="text-gray-500">
                  View your class timings and locations for the week.
                </p>
              </div>
              <table className="w-full text-sm text-center border-collapse mt-6">
                <thead>
                  <tr className="">
                    <th className="text-gray-500">Time</th>
                    <th>Saturday</th>
                    <th>Sunday</th>
                    <th>Monday</th>
                    <th>Tuesday</th>
                    <th>Wednesday</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="p-2">
                    <td className="text-gray-500">8:00 AM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">9:00 AM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">10:00 AM</td>
                    <td className="p-2">
                      <div className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                        <p className="font-semibold text-lg">CSE-3642</p>
                        <p>Lab 301</p>
                      </div>
                    </td>
                    <td>
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                        <p className="font-semibold text-lg">CSE-3631</p>
                        <p>Room 301</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-3 py-2 bg-blue-600 text-white rounded-lg">
                        <p className="font-semibold text-lg">CSE-3631</p>
                        <p>Room 301</p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">11:00 AM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">12:00 PM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">1:00 PM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">2:00 PM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-3 py-2  bg-blue-600 text-white rounded-lg">
                        <p className="font-semibold text-lg">CSE-3641</p>
                        <p>Room 205</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-3 py-2  bg-blue-600 text-white rounded-lg">
                        <p className="font-semibold text-lg">CSE-3641</p>
                        <p>Room 205</p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">3:00 PM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">4:00 PM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-gray-500">5:00 PM</td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                    <td className="p-2">
                      <div className="px-2 py-2 border border-gray-300 rounded-lg">
                        <p className="font-semibold text-lg"></p>
                        <p></p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* course Details */}
            <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-md">
              <div className="mb-5">
                <p className="text-3xl font-bold mb-1">Course Details</p>
                <p className="text-lg text-gray-500">
                  Complete information about your enrolled courses.
                </p>
              </div>
              <div>
                {/* 1st course*/}
                <div className="mb-4">
                  <div className=" bg-gray-200 p-4 rounded-lg">
                    <div className="flex gap-3 mb-2">
                      <h1 className="text-2xl font-bold">CSE-3642</h1>
                      <p className="border border-gray-400 px-2 py-1 rounded-lg text-sm font-semibold">
                        Software Engineering lab
                      </p>
                    </div>
                    <div className="text-gray-500">
                      <p>Instructor: Ahasanul Kalam Akib</p>
                      <p>Room: Lab 301</p>
                      <p>Days: Sunday. 10:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                </div>
                {/* 2nd course*/}
                <div className="mb-4">
                  <div className=" bg-gray-200 p-4 rounded-lg">
                    <div className="flex gap-3 mb-2">
                      <h1 className="text-2xl font-bold">CSE-3641</h1>
                      <p className="border border-gray-400 px-2 py-1 rounded-lg text-sm font-semibold">
                        Software Engineering
                      </p>
                    </div>
                    <div className="text-gray-500">
                      <p>Instructor: Dr. Rahman</p>
                      <p>Room: Room 205</p>
                      <p>Days: Monday, Wednesday. 10:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                </div>
                {/* 3rd course */}
                <div className="mb-4">
                  <div className=" bg-gray-200 p-4 rounded-lg">
                    <div className="flex gap-3 mb-2">
                      <h1 className="text-2xl font-bold">CSE-3631</h1>
                      <p className="border border-gray-400 px-2 py-1 rounded-lg text-sm font-semibold">
                        Database Systems
                      </p>
                    </div>
                    <div className="text-gray-500">
                      <p>Instructor: Dr. Ahmed</p>
                      <p>Room: Room 301</p>
                      <p>Days: Tuesday, Thursday. 10:00 AM - 12:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default MySchedule;
