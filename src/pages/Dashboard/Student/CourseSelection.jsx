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
function CourseSelection() {
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
            <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-lg">
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
          <aside className="sidebar border-r border-gray-200 p-4 w-64 left-0 top-16 sticky h-[calc(100vh-64px)]">
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
                className="flex items-center gap-3 p-4 bg-blue-600 text-white rounded-lg"
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

          <main className=" p-4 md:p-8 lg:p-8 mt-16 flex flex-col gap-6 md:gap-8 lg:gap-6 flex-1 overflow-y-auto bg-gray-50">
            <div>
              <p className="text-3xl font-bold">Course Selection</p>
              <p className="text-lg font-gray-600">
                Browse and select courses for Spring 2025{" "}
              </p>
            </div>
            <div className="flex lg:flex-row border border-gray-300 p-6 py-8 rounded-lg justify-between items-center gap-4">
              <div className="flex ">
                <div className="border-r-2 border-gray-400 p-4">
                  <p className="text-gray-500 font-semibold">
                    Selected Courses
                  </p>
                  <p className="font-bold text-2xl">3</p>
                </div>
                <div className=" p-4">
                  <p className="text-gray-500 font-semibold">Total Credits</p>
                  <p className="font-bold text-2xl">7</p>
                </div>
              </div>
              <button className="bg-blue-600 text-white rounded px-3 py-2 ml-auto hover:bg-blue-700 cursor-pointer">
                Submit for Approval
              </button>
            </div>
            <div className="border border-gray-300 p-6 py-8 rounded-lg  flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:px-8">
              <div>
                <p className="text-lg font-semibold">Search Courses</p>
                <div className="flex border border-gray-300 rounded-lg p-2 gap-2 items-center">
                  <Search className="w-4" />
                  <input
                    className="border-none outline-none w-[600px]"
                    type="text"
                    placeholder="Search by course name or code or instructor.."
                  />
                </div>
              </div>
              <div className="md:pr-8">
                <p className="text-lg font-semibold">Department</p>
                <select className="border border-gray-300 rounded-lg p-2 w-full md:w-48">
                  <option>All Departments</option>
                  <option>CSE</option>
                  <option>EEE</option>
                  <option>ETE</option>
                  <option>CCE</option>
                  <option>Civil</option>
                </select>
              </div>
            </div>
            <div>
              {/* Courses details - 1 */}
              <div className="border border-gray-300 bg-white rounded-lg mt-6 p-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="py-0.5">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-xl mb-2">CSE-3642 </p>
                    <p className="border p-1 font-medium border-gray-300 rounded-lg">
                      1 Credits
                    </p>
                  </div>
                  <p className="font-semibold mb-1.5">
                    Software Engineering Lab
                  </p>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                    <Users className="w-4 " />
                    <span>Ahasanul kalam Akib</span>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Seats :
                      <span className="text-green-500 font-semibold">
                        5/30 available
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 flex md:flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-5 h-5" />
                    <p>Sun 10:00 AM - 12:00 PM</p>
                  </div>
                  <p>
                    Prerequisites:{" "}
                    <span className="text-black font-semibold"> CSE-2641</span>
                  </p>
                </div>
                <div>
                  <button className="flex py-2 px-4 bg-blue-600 text-white rounded-lg gap-2 items-center cursor-pointer hover:bg-blue-700">
                    <Check className="w-5" />
                    <p className="font-semibold">Selected</p>
                  </button>
                </div>
              </div>
              {/* courses details - 2 */}
              <div className="border border-gray-300 bg-white rounded-lg mt-4 p-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="py-0.5">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-xl mb-2">CSE-3641 </p>
                    <span className="border p-1 font-medium border-gray-300 rounded-lg">
                      3 Credits
                    </span>
                  </div>
                  <p className="font-semibold mb-1.5">Software Engineering</p>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                    <Users className="w-4 " />
                    <span>Ahasanul kalam Akib</span>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Seats :
                      <span className="text-green-500 font-semibold">
                        12/40 available
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 flex md:flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-5 h-5" />
                    <p>Mon,Wed 02:00 PM - 3:30 PM</p>
                  </div>
                  <p>
                    Prerequisites:{" "}
                    <span className="text-black font-semibold"> CSE-2641</span>
                  </p>
                </div>
                <div>
                  <button className="flex py-2 px-4 bg-blue-600 text-white rounded-lg gap-2 items-center cursor-pointer hover:bg-blue-700">
                    <Check className="w-5" />
                    <p className="font-semibold">Selected</p>
                  </button>
                </div>
              </div>
              {/* courses details - 3 */}
              <div className="border border-gray-300 bg-white rounded-lg mt-4 p-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="py-0.5">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-xl mb-2">CSE-3631 </p>
                    <span className="border p-1 font-medium border-gray-300 rounded-lg">
                      3 Credits
                    </span>
                  </div>
                  <p className="font-semibold mb-1.5">Database Systems</p>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                    <Users className="w-4 " />
                    <span>Dr. Ahmed</span>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Seats :
                      <span className="text-green-500 font-semibold">
                        8/35 available
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 flex md:flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-5 h-5" />
                    <p>Tue, Thu 10:00 AM - 11:30 AM</p>
                  </div>
                  <p>
                    Prerequisites:{" "}
                    <span className="text-black font-semibold"> CSE-2621</span>
                  </p>
                </div>
                <div>
                  <button className="flex py-2 px-4 bg-blue-600 text-white rounded-lg gap-2 items-center cursor-pointer hover:bg-blue-700">
                    <Check className="w-5" />
                    <p className="font-semibold">Selected</p>
                  </button>
                </div>
              </div>
              {/* courses details - 4 */}
              <div className="border border-gray-300 bg-white rounded-lg mt-4 p-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="py-0.5">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-xl mb-2">CSE-3651 </p>
                    <span className="border p-1 font-medium border-gray-300 rounded-lg">
                      3 Credits
                    </span>
                    <span className="text-white bg-red-600 p-1 rounded-lg px-2 flex items-center gap-1">
                      <AlertTriangle className="w-4 h-4" />
                      Conflict
                    </span>
                  </div>
                  <p className="font-semibold mb-1.5">Computer Networks</p>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                    <Users className="w-4 " />
                    <span>Dr. Khan</span>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Seats :
                      <span className="text-green-500 font-semibold">
                        15/40 available
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 flex md:flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-5 h-5" />
                    <p>Sun,Tue 1:00 PM - 2:30 PM</p>
                  </div>
                  <p>
                    Prerequisites:{" "}
                    <span className="text-black font-semibold"> CSE-2641</span>
                  </p>
                </div>
                <div>
                  <button className="flex py-2 px-4 rounded-lg gap-2 items-center border border-gray-400 cursor-pointer">
                    <Plus className="w-5" />
                    <p className="font-semibold">Add</p>
                  </button>
                </div>
              </div>
              {/* courses details - 5 */}
              <div className="border border-gray-300 bg-white rounded-lg mt-4 p-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="py-0.5">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-xl mb-2">CSE-3661 </p>
                    <span className="border p-1 font-medium border-gray-300 rounded-lg">
                      3 Credits
                    </span>
                  </div>
                  <p className="font-semibold mb-1.5">
                    Artificial Intelligence
                  </p>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                    <Users className="w-4 " />
                    <span>Dr. Hasan</span>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Seats :
                      <span className="text-red-500 font-semibold">
                        5/30 available
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 flex md:flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-5 h-5" />
                    <p>Mon, Wed 10:00 AM - 11:30 AM</p>
                  </div>
                  <p>
                    Prerequisites:{" "}
                    <span className="text-black font-semibold">
                      {" "}
                      CSE-2641, MATH-2101
                    </span>
                  </p>
                </div>
                <div>
                  <button className="flex py-2 px-4 rounded-lg gap-2 items-center border border-gray-400 cursor-pointer">
                    <Plus className="w-5" />
                    <p className="font-semibold">Add</p>
                  </button>
                </div>
              </div>
              {/* courses details - 6 */}
              <div className="border border-gray-300 bg-white rounded-lg mt-4 p-6 py-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="py-0.5">
                  <div className="flex gap-3 items-center">
                    <p className="font-bold text-xl mb-2">ENG-3101 </p>
                    <span className="border p-1 font-medium border-gray-300 rounded-lg">
                      2 Credits
                    </span>
                  </div>
                  <p className="font-semibold mb-1.5">Technical Writing</p>
                  <div className="flex gap-2 items-center text-gray-500 text-sm mb-1.5">
                    <Users className="w-4 " />
                    <span>Prof. Smith</span>
                  </div>
                  <div>
                    <p className="text-gray-500">
                      Seats :
                      <span className="text-green-500 font-semibold">
                        20/50 available
                      </span>
                    </p>
                  </div>
                </div>
                <div className="text-gray-500 flex md:flex-col">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Clock className="w-5 h-5" />
                    <p>Thu 3:00 PM - 5:00 PM</p>
                  </div>
                </div>
                <div>
                  <button className="flex py-2 px-4 rounded-lg gap-2 items-center border border-gray-400 cursor-pointer">
                    <Plus className="w-5" />
                    <p className="font-semibold">Add</p>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default CourseSelection;
