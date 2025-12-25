import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Edit, Trash2, X, Bell, LogOut, Menu } from "lucide-react";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import { listCourses, createCourse, updateCourse, deleteCourse, listTeachers, listSections } from "../../../../api/adminApi";
import Swal from "sweetalert2";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useUserRole from "../../../../hooks/useUserRole/useUserRole";

// Initial Course Data structure matching backend API
const emptyCourse = {
    courseCode: "",
    courseName: "",
    credits: '',
    department: "CSE",
    prerequisite: "",
    semester: "",
    instructors: [],
    instructorSections: {},
};

const CourseManagement = () => {
    const navigate = useNavigate();
    const { logoutUser } = useAuth();
    const { role } = useUserRole();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState(emptyCourse);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All Departments');
    const [filterStatus, setFilterStatus] = useState('');
    const [teachers, setTeachers] = useState([]);
    const [sections, setSections] = useState([]);

    // Fetch courses from API
    useEffect(() => {
        fetchCourses();
        fetchTeachers();
        fetchSectionsList();
    }, [filterDept, filterStatus, searchTerm]);

    const fetchTeachers = async () => {
        try {
            const response = await listTeachers();
            if (response.data.success) {
                setTeachers(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching teachers:', error);
        }
    };

    const fetchSectionsList = async () => {
        try {
            const response = await listSections();
            if (response.data.success) {
                setSections(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
        }
    };

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const params = {};
            if (searchTerm) params.search = searchTerm;
            if (filterDept !== 'All Departments') params.department = filterDept;
            if (filterStatus) params.status = filterStatus;

            const response = await listCourses(params);
            if (response.data.success) {
                setCourses(response.data.data || []);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to load courses",
            });
        } finally {
            setLoading(false);
        }
    };

    const openModal = (course = null) => {
        if (course) {
            setNewCourseData({
                courseCode: course.courseCode || "",
                courseName: course.courseName || "",
                credits: course.credits || 3,
                department: course.department || "CSE",
                prerequisite: course.prerequisite || "",
                semester: course.semester || "",
                status: course.status || "active",
                instructors: course.instructors || [],
                instructorSections: (course.instructorSections || []).reduce((acc, item) => {
                    if (item?.instructorId) {
                        acc[item.instructorId] = item.sections || [];
                    }
                    return acc;
                }, {}),
            });
            setIsEditing(true);
        } else {
            setNewCourseData(emptyCourse);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;
        if (name === 'instructors') {
            const values = Array.from(selectedOptions || []).map((opt) => opt.value);
            setNewCourseData((prev) => ({
                ...prev,
                instructors: values,
                // prune instructorSections for removed instructors
                instructorSections: Object.fromEntries(
                    Object.entries(prev.instructorSections || {}).filter(([key]) => values.includes(key))
                ),
            }));
            return;
        }
        setNewCourseData((prev) => ({
            ...prev,
            [name]: type === 'number' ? (value === '' ? '' : parseFloat(value) || 0) : value,
        }));
    };

    const handleInstructorSectionsChange = (instructorId, selectedSections) => {
        setNewCourseData((prev) => ({
            ...prev,
            instructorSections: {
                ...(prev.instructorSections || {}),
                [instructorId]: selectedSections,
            },
        }));
    };

    const handleSaveCourse = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                // Find the course ID from the current courses list
                const courseToUpdate = courses.find(c => c.courseCode === newCourseData.courseCode);
                if (!courseToUpdate) {
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Course not found",
                    });
                    return;
                }

                const payload = {
                    ...newCourseData,
                    instructorSections: Object.entries(newCourseData.instructorSections || {}).map(
                        ([instructorId, sections]) => ({
                            instructorId,
                            sections: sections || [],
                        })
                    ),
                };
                const response = await updateCourse(courseToUpdate.id, payload);
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Course updated successfully",
                        timer: 1500,
                    });
                    fetchCourses();
                    setIsModalOpen(false);
                }
            } else {
                const payload = {
                    ...newCourseData,
                    instructorSections: Object.entries(newCourseData.instructorSections || {}).map(
                        ([instructorId, sections]) => ({
                            instructorId,
                            sections: sections || [],
                        })
                    ),
                };
                const response = await createCourse(payload);
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Course added successfully",
                        timer: 1500,
                    });
                    fetchCourses();
                    setIsModalOpen(false);
                }
            }
        } catch (error) {
            console.error('Error saving course:', error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "Failed to save course",
            });
        }
    };

    const handleDeleteCourse = async (courseId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteCourse(courseId);
                if (response.data.success) {
                    Swal.fire({
                        icon: "success",
                        title: "Deleted",
                        text: "Course deleted successfully",
                        timer: 1500,
                    });
                    fetchCourses();
                }
            } catch (error) {
                console.error('Error deleting course:', error);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: error.response?.data?.message || "Failed to delete course",
                });
            }
        }
    };

    // Get unique departments from courses
    const departments = useMemo(() => {
        const depts = new Set(courses.map(c => c.department).filter(Boolean));
        return ['All Departments', ...Array.from(depts)];
    }, [courses]);

    // Calculate statistics from API response or courses
    const stats = useMemo(() => {
        const activeCourses = courses.filter(c => c.status === 'active').length;
        return {
            total: courses.length,
            active: activeCourses,
        };
    }, [courses]);

    // Filter and search courses (client-side filtering for better UX)
    const filteredCourses = useMemo(() => {
        let result = courses;

        // Search filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(course =>
                (course.courseCode || '').toLowerCase().includes(lowerSearchTerm) ||
                (course.courseName || '').toLowerCase().includes(lowerSearchTerm)
            );
        }

        return result.sort((a, b) => (a.courseCode || '').localeCompare(b.courseCode || ''));
    }, [courses, searchTerm]);

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
            <div className="flex-1 overflow-auto">
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
                                    <p className="text-xs text-gray-500">Course Management</p>
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

                <div className="p-6 md:p-10 space-y-8 font-sans">
                    {/* Header & Add Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">Course Management</h1>
                            <p className="text-gray-500 mt-1">Manage course offerings and schedules</p>
                        </div>
                        <button
                            onClick={() => openModal()}
                            className="mt-4 sm:mt-0 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg shadow-blue-500/50"
                        >
                            + Add Course
                        </button>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <h3 className="text-sm text-gray-500 font-medium">Total Courses</h3>
                            <p className="text-2xl font-bold mt-1 text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <h3 className="text-sm text-gray-500 font-medium">Active Courses</h3>
                            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.active}</p>
                        </div>
                    </div>

                    {/* Search and Filter */}
                    <div className="p-4 bg-white rounded-xl shadow-md border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Search Courses</h2>
                        <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="relative w-full md:w-3/4">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by code or name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg pl-10 pr-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm transition"
                                />
                            </div>
                            <select
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                                className="border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/4 w-full appearance-none bg-white"
                            >
                                {departments.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Course List - Table */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">All Courses ({filteredCourses.length})</h2>
                        <p className="text-gray-500 text-sm">Manage course details, schedules, and instructors</p>
                        {loading ? (
                            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4">Loading courses...</p>
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Department</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Semester</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Code</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Credits</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Instructors</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Prerequisite</th>
                                            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredCourses.map((course) => {
                                            const instructorNames =
                                                (course.instructors || [])
                                                    .map((id) => teachers.find((t) => t.teacherId === id)?.name || id)
                                                    .filter(Boolean)
                                                    .join(', ');
                                            return (
                                                <tr key={course.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm text-gray-700">{course.department}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{course.semester}</td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{course.courseCode}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{course.courseName}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{course.credits}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{instructorNames || 'N/A'}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-700">{course.prerequisite || '—'}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => openModal(course)}
                                                                className="text-blue-600 hover:text-blue-800"
                                                                title="Edit"
                                                            >
                                                                <Edit size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteCourse(course.id)}
                                                                className="text-red-600 hover:text-red-800"
                                                                title="Delete"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
                                No courses found matching your search or filter criteria.
                            </div>
                        )}
                    </div>

                    {/* Modal for Add/Edit Course */}
                    {isModalOpen && (
                        <div className="fixed inset-0 backdrop-brightness-50 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
                             onClick={() => setIsModalOpen(false)}>
                            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg"
                                 onClick={e => e.stopPropagation()}>
                                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        {isEditing ? 'Edit Course' : 'Add New Course'}
                                    </h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 transition p-1"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSaveCourse} className="p-6 space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Course Code</label>
                                            <input 
                                                type="text" 
                                                name="courseCode" 
                                                value={newCourseData.courseCode} 
                                                onChange={handleFormChange} 
                                                placeholder="e.g., CSE-3642" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Course Name</label>
                                            <input 
                                                type="text" 
                                                name="courseName" 
                                                value={newCourseData.courseName} 
                                                onChange={handleFormChange} 
                                                placeholder="e.g., Software Engineering" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Credits</label>
                                            <input 
                                                type="number" 
                                                name="credits" 
                                                value={newCourseData.credits} 
                                                onChange={handleFormChange} 
                                                placeholder="3" 
                                                min="0.75" 
                                                max="4"
                                                step="0.25"
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                                            <input 
                                                type="text" 
                                                name="department" 
                                                value={newCourseData.department} 
                                                onChange={handleFormChange} 
                                                placeholder="CSE" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Prerequisite</label>
                                            <input 
                                                type="text" 
                                                name="prerequisite" 
                                                value={newCourseData.prerequisite} 
                                                onChange={handleFormChange} 
                                                placeholder="Optional" 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Semester</label>
                                            <input 
                                                type="text" 
                                                name="semester" 
                                                value={newCourseData.semester} 
                                                onChange={handleFormChange} 
                                                placeholder="1" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        
                                        <div className="col-span-1 sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Instructors</label>
                                            <select
                                                name="instructors"
                                                multiple
                                                value={newCourseData.instructors}
                                                onChange={handleFormChange}
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                            >
                                                {teachers.map((t) => (
                                                    <option key={t.id} value={t.teacherId}>
                                                        {t.name} ({t.teacherId})
                                                    </option>
                                                ))}
                                            </select>
                                            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple.</p>
                                        </div>
                                        {newCourseData.instructors.map((instId) => {
                                            const selectedSections = newCourseData.instructorSections?.[instId] || [];
                                            return (
                                                <div key={instId} className="col-span-1 sm:col-span-2 border rounded-lg p-3 bg-gray-50">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">
                                                        Sections for {teachers.find((t) => t.teacherId === instId)?.name || instId}
                                                    </p>
                                                    <select
                                                        multiple
                                                        value={selectedSections}
                                                        onChange={(e) => {
                                                            const vals = Array.from(e.target.selectedOptions || []).map((opt) => opt.value);
                                                            handleInstructorSectionsChange(instId, vals);
                                                        }}
                                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                                                    >
                                                        {sections.map((s) => (
                                                            <option key={s.id} value={s.sectionName}>
                                                                {s.sectionName} ({s.semester})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <p className="text-xs text-gray-500 mt-1">Assign this instructor to sections (multi-select).</p>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Buttons */}
                                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 text-sm font-medium transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-md shadow-blue-500/30"
                                        >
                                            {isEditing ? 'Save Changes' : 'Add Course'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseManagement;
