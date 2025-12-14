import React, { useState, useMemo, useEffect } from "react";
import { Search, Edit, Trash2, X } from "lucide-react";
import AdminSidebar from "../../../../components/AdminSidebar/AdminSidebar";
import { listCourses, createCourse, updateCourse, deleteCourse } from "../../../../api/adminApi";
import Swal from "sweetalert2";

// Initial Course Data structure matching backend API
const emptyCourse = {
    courseCode: "",
    courseName: "",
    credits: 3,
    department: "Computer Science",
    prerequisite: "",
    regularSeats: 40,
    irregularSeats: 10,
    semester: "Spring 2025",
    status: "active",
};

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState(emptyCourse);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All Departments');
    const [filterStatus, setFilterStatus] = useState('');

    // Fetch courses from API
    useEffect(() => {
        fetchCourses();
    }, [filterDept, filterStatus, searchTerm]);

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
                department: course.department || "Computer Science",
                prerequisite: course.prerequisite || "",
                regularSeats: course.regularSeats || 40,
                irregularSeats: course.irregularSeats || 10,
                semester: course.semester || "Spring 2025",
                status: course.status || "active",
            });
            setIsEditing(true);
        } else {
            setNewCourseData(emptyCourse);
            setIsEditing(false);
        }
        setIsModalOpen(true);
    };

    const handleFormChange = (e) => {
        const { name, value, type } = e.target;
        setNewCourseData((prev) => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
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

                const response = await updateCourse(courseToUpdate.id, newCourseData);
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
                const response = await createCourse(newCourseData);
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
        const totalSeats = courses.reduce((sum, c) => sum + (c.regularSeats || 0) + (c.irregularSeats || 0), 0);
        const availableSeats = courses.reduce((sum, c) => sum + (c.availableSeats || 0), 0);
        const activeCourses = courses.filter(c => c.status === 'active').length;

        return {
            total: courses.length,
            active: activeCourses,
            totalSeats: totalSeats,
            availableSeats: availableSeats,
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

    // Course Card Component
    const CourseCard = ({ course }) => {
        const available = course.availableSeats || 0;
        const totalSeats = (course.regularSeats || 0) + (course.irregularSeats || 0);
        const isFull = available <= 0;
        const isLowSeats = available > 0 && available <= 10;

        const statusText = isFull ? 'Full' : (isLowSeats ? 'Low Seats' : course.status === 'active' ? 'Active' : 'Inactive');
        const statusBg = isFull ? 'bg-red-500' : (isLowSeats ? 'bg-yellow-100 text-yellow-700' : course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700');
        const availableColor = isFull ? 'text-red-500' : (isLowSeats ? 'text-yellow-600' : 'text-green-600');
        const lowSeatsBadge = isLowSeats ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 ml-2">Low Seats</span> : null;
        
        return (
            <div className="flex justify-between items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-grow space-y-1">
                    <div className="flex items-center space-x-2">
                        <span className="text-base font-semibold text-gray-800">{course.courseCode}</span>
                        <span className="text-sm text-gray-500">• {course.credits} Credits</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg}`}>
                            {statusText}
                        </span>
                        {lowSeatsBadge}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{course.courseName}</p>
                    <div className="text-xs text-gray-500 grid grid-cols-2 mt-2">
                        <div>Department: <span className="font-medium text-gray-700">{course.department}</span></div>
                        <div>Semester: <span className="font-medium text-gray-700">{course.semester}</span></div>
                        {course.prerequisite && (
                            <div className="col-span-2">Prerequisite: <span className="font-medium text-gray-700">{course.prerequisite}</span></div>
                        )}
                    </div>
                </div>
                <div className="text-right space-y-1 min-w-[200px]">
                    <p className={`text-sm font-semibold ${availableColor}`}>
                        Seats: {available}/{totalSeats} available
                    </p>
                    <div className="flex space-x-2 justify-end pt-2">
                        <button
                            onClick={() => openModal(course)}
                            title="Edit Course"
                            className="text-gray-400 hover:text-blue-500 transition p-1 rounded-full hover:bg-gray-100"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            onClick={() => handleDeleteCourse(course.id)}
                            title="Delete Course"
                            className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-gray-100"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen bg-gray-50">
            <AdminSidebar />
            <div className="flex-1 overflow-auto">
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
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <h3 className="text-sm text-gray-500 font-medium">Total Courses</h3>
                            <p className="text-2xl font-bold mt-1 text-gray-800">{stats.total}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <h3 className="text-sm text-gray-500 font-medium">Active Courses</h3>
                            <p className="text-2xl font-bold mt-1 text-blue-600">{stats.active}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <h3 className="text-sm text-gray-500 font-medium">Total Seats</h3>
                            <p className="text-2xl font-bold mt-1 text-gray-800">{stats.totalSeats}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                            <h3 className="text-sm text-gray-500 font-medium">Available Seats</h3>
                            <p className="text-2xl font-bold mt-1 text-green-600">{stats.availableSeats}</p>
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
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="border border-gray-200 rounded-lg py-2.5 px-4 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none md:w-1/4 w-full appearance-none bg-white"
                            >
                                <option value="">All Status</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>

                    {/* Course List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">All Courses ({filteredCourses.length})</h2>
                        <p className="text-gray-500 text-sm">Manage course details, schedules, and seat allocation</p>
                        {loading ? (
                            <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-4">Loading courses...</p>
                            </div>
                        ) : filteredCourses.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {filteredCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
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
                                                min="1" 
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
                                                placeholder="Computer Science" 
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
                                                placeholder="Spring 2025" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Regular Seats</label>
                                            <input 
                                                type="number" 
                                                name="regularSeats" 
                                                value={newCourseData.regularSeats} 
                                                onChange={handleFormChange} 
                                                placeholder="40" 
                                                min="1" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Irregular Seats</label>
                                            <input 
                                                type="number" 
                                                name="irregularSeats" 
                                                value={newCourseData.irregularSeats} 
                                                onChange={handleFormChange} 
                                                placeholder="10" 
                                                min="0" 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" 
                                            />
                                        </div>
                                        <div className="col-span-1 sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                                            <select 
                                                name="status" 
                                                value={newCourseData.status} 
                                                onChange={handleFormChange} 
                                                required 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Inactive</option>
                                            </select>
                                        </div>
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
