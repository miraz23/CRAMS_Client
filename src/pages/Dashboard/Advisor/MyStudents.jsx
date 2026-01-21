import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Clock,
  Users,
  CheckCircle,
  Search,
  Mail,
  Phone,
  User,
  Eye,
  Calendar,
  MapPin,
  BookOpen,
} from "lucide-react";
import AdvisorSidebar from "../../../Components/AdvisorSidebar/AdvisorSidebar";
import useAuth from "../../../hooks/useAuth/useAuth";
import { getMyStudents, getStudentDetails } from "../../../api/teacherApi";
import Swal from "sweetalert2";

export default function MyStudents() {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [summary, setSummary] = useState({ totalStudents: 0, pendingReviews: 0, averageCGPA: null });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchMyStudents();
  }, [searchQuery]);

  const fetchMyStudents = async () => {
    try {
      setLoading(true);
      const params = searchQuery ? { search: searchQuery } : {};
      const data = await getMyStudents(params);
      
      setSummary(data.summary || { totalStudents: 0, pendingReviews: 0, averageCGPA: null });
      
      // Format students for display
      const formattedStudents = (data.students || []).map((student, index) => ({
        id: index + 1,
        name: student.name || "Unknown Student",
        studentId: student.studentId || "",
        credits: student.credits || 0,
        semester: student.semester || "N/A",
        status: student.status || "Active",
        email: student.email || "",
        phone: student.mobileNumber || "N/A",
        pendingReviews: student.pendingCount || 0,
        studentMongoId: student._id,
        department: student.department || "N/A",
      }));
      setStudents(formattedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load students",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students; // Already filtered by backend

  const handleViewDetails = async (student) => {
    setSelectedStudent(student);
    setIsDetailsModalOpen(true);
    setLoadingDetails(true);
    
    try {
      const details = await getStudentDetails(student.studentMongoId);
      setStudentDetails(details);
    } catch (error) {
      console.error("Error fetching student details:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to load student details",
      });
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdvisorSidebar
        onLogout={async () => {
          try {
            await logoutUser();
            navigate("/login");
          } catch (error) {
            console.error("Logout error:", error);
            navigate("/login");
          }
        }}
      />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              My Students
            </h2>
            <p className="text-gray-600">
              Manage and view your advisee information
            </p>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Students</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {summary.totalStudents || 0}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {summary.pendingReviews || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average CGPA</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {summary.averageCGPA ? summary.averageCGPA.toFixed(2) : "N/A"}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </div>
          )}

          {/* Search Section */}
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Search Students
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, ID, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Students Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-500">Loading students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
              <p className="text-gray-500 text-lg">No students found</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Credits
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.studentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {student.department || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {student.semester || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.credits || 0}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            student.status === 'Active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.status}
                          </span>
                          {student.pendingReviews > 0 && (
                            <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              {student.pendingReviews} pending
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleViewDetails(student)}
                            className="text-blue-600 hover:text-blue-900 flex items-center space-x-1"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Student Details Modal */}
          {isDetailsModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Student Details
                  </h3>
                  <button
                    onClick={closeDetailsModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6">
                  {loadingDetails ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-500">Loading details...</p>
                    </div>
                  ) : studentDetails ? (
                    <div className="space-y-6">
                      {/* Student Basic Information */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>Basic Information</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Student ID</p>
                            <p className="text-base font-medium text-gray-900">
                              {studentDetails.student?.studentId || selectedStudent?.studentId}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Name</p>
                            <p className="text-base font-medium text-gray-900">
                              {studentDetails.student?.name || selectedStudent?.name}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Email</p>
                            <p className="text-base font-medium text-gray-900 flex items-center space-x-2">
                              <Mail className="w-4 h-4" />
                              <span>{studentDetails.student?.email || selectedStudent?.email}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                            <p className="text-base font-medium text-gray-900 flex items-center space-x-2">
                              <Phone className="w-4 h-4" />
                              <span>{studentDetails.student?.mobileNumber || selectedStudent?.phone || "N/A"}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Department</p>
                            <p className="text-base font-medium text-gray-900">
                              {studentDetails.student?.department || selectedStudent?.department || "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Date of Birth</p>
                            <p className="text-base font-medium text-gray-900 flex items-center space-x-2">
                              <Calendar className="w-4 h-4" />
                              <span>{studentDetails.student?.dateOfBirth || "N/A"}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Gender</p>
                            <p className="text-base font-medium text-gray-900">
                              {studentDetails.student?.gender || "N/A"}
                            </p>
                          </div>
                        </div>
                        {(studentDetails.student?.presentAddress || studentDetails.student?.permanentAddress) && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-500 mb-1">Address</p>
                            <div className="space-y-1">
                              {studentDetails.student?.presentAddress && (
                                <p className="text-base text-gray-900 flex items-start space-x-2">
                                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                  <span><strong>Present:</strong> {studentDetails.student.presentAddress}</span>
                                </p>
                              )}
                              {studentDetails.student?.permanentAddress && (
                                <p className="text-base text-gray-900 flex items-start space-x-2">
                                  <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                                  <span><strong>Permanent:</strong> {studentDetails.student.permanentAddress}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Academic Information */}
                      <div className="bg-gray-50 rounded-lg p-6">
                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                          <BookOpen className="w-5 h-5" />
                          <span>Academic Information</span>
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">CGPA</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {studentDetails.academic?.cgpa 
                                ? studentDetails.academic.cgpa.toFixed(2) 
                                : "N/A"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Total Credits</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {studentDetails.academic?.credits || 0}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Current Semester</p>
                            <p className="text-xl font-medium text-gray-900">
                              {studentDetails.academic?.semester || selectedStudent?.semester || "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Course Registrations */}
                      {studentDetails.registrations && (
                        <div className="bg-gray-50 rounded-lg p-6">
                          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5" />
                            <span>Course Registrations</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-white rounded p-3">
                              <p className="text-xs text-gray-500 mb-1">Total</p>
                              <p className="text-xl font-bold text-gray-900">
                                {studentDetails.registrations.total || 0}
                              </p>
                            </div>
                            <div className="bg-green-50 rounded p-3">
                              <p className="text-xs text-gray-500 mb-1">Approved</p>
                              <p className="text-xl font-bold text-green-700">
                                {studentDetails.registrations.approved || 0}
                              </p>
                            </div>
                            <div className="bg-yellow-50 rounded p-3">
                              <p className="text-xs text-gray-500 mb-1">Pending</p>
                              <p className="text-xl font-bold text-yellow-700">
                                {studentDetails.registrations.pending || 0}
                              </p>
                            </div>
                            <div className="bg-red-50 rounded p-3">
                              <p className="text-xs text-gray-500 mb-1">Rejected</p>
                              <p className="text-xl font-bold text-red-700">
                                {studentDetails.registrations.rejected || 0}
                              </p>
                            </div>
                          </div>
                          {studentDetails.registrations.courses && studentDetails.registrations.courses.length > 0 && (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-white border-b border-gray-200">
                                  <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course Code</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Course Name</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Credits</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Semester</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                  </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                  {studentDetails.registrations.courses.map((course, idx) => (
                                    <tr key={idx}>
                                      <td className="px-4 py-2 font-medium text-gray-900">{course.courseCode}</td>
                                      <td className="px-4 py-2 text-gray-600">{course.courseName}</td>
                                      <td className="px-4 py-2 text-gray-900">{course.credits}</td>
                                      <td className="px-4 py-2 text-gray-600">{course.semester}</td>
                                      <td className="px-4 py-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                          course.status === 'approved' ? 'bg-green-100 text-green-800' :
                                          course.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                          course.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                          'bg-gray-100 text-gray-800'
                                        }`}>
                                          {course.status}
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Failed to load student details</p>
                    </div>
                  )}
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
                  <button
                    onClick={closeDetailsModal}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
