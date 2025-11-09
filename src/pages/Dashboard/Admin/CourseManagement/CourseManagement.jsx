import React, { useState, useMemo } from "react";
import { Search, Edit, Trash2, X } from "lucide-react";

// Initial Course Data structure
const emptyCourse = {
    id: null,
    code: "",
    name: "",
    credits: 3,
    department: "Computer Science",
    instructor: "",
    schedule: "Mon, Wed 10:00 AM - 11:30 AM", // Default schedule
    totalSeats: 40,
    enrolled: 0, // for calculating availability
};

// sample data
const initialCourses = [
    { id: 1, code: "CSE-3642", name: "Software Engineering Lab", credits: 1, department: "Computer Science", instructor: "Ahasanul Kalib", schedule: "Sun 10:00 AM - 12:00 PM", totalSeats: 40, enrolled: 35 },
    { id: 2, code: "CSE-3641", name: "Software Engineering", credits: 3, department: "Computer Science", instructor: "Dr. Rahman", schedule: "Mon, Wed 2:00 PM - 3:30 PM", totalSeats: 40, enrolled: 28 },
    { id: 3, code: "MGT-201", name: "Database Systems", credits: 3, department: "Management", instructor: "Dr. Ahmed", schedule: "Tue, Thu 10:00 AM - 11:30 AM", totalSeats: 40, enrolled: 32 },
    { id: 4, code: "EEE-101", name: "Electrical Circuits", credits: 3, department: "Electrical Engineering", instructor: "Dr. Khan", schedule: "Sun, Tue 1:00 PM - 2:30 PM", totalSeats: 40, enrolled: 25 },
    { id: 5, code: "CSE-3661", name: "Artificial Intelligence", credits: 3, department: "Computer Science", instructor: "Dr. Hasan", schedule: "Mon, Wed 10:00 AM - 11:30 AM", totalSeats: 30, enrolled: 27 },
];

const DepartmentOptions = [ 'Computer Science',];

const CourseManagement = () => {
    const [courses, setCourses] = useState(initialCourses);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState(emptyCourse);
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDept, setFilterDept] = useState('All Departments');

    const openModal = (course = null) => {
        if (course) {
           
            setNewCourseData({ ...course });
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
            // Convert numbers to integers,
            [name]: type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleSaveCourse = (e) => {
        e.preventDefault();

        // Ensure IDs are consistent and unique
        if (isEditing && newCourseData.id) {
            setCourses((prev) =>
                prev.map((c) => (c.id === newCourseData.id ? newCourseData : c))
            );
        } else {
            setCourses((prev) => [...prev, { ...newCourseData, id: Date.now() }]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteCourse = (courseId) => {
        // Use a simple confirmation dialog
        if (window.confirm("Are you sure you want to delete this course?")) {
            setCourses((prev) => prev.filter((c) => c.id !== courseId));
        }
    };

    // Calculate derived statistics
    const stats = useMemo(() => {
        const totalSeats = courses.reduce((sum, c) => sum + (c.totalSeats || 0), 0);
        const availableSeats = courses.reduce((sum, c) => sum + ((c.totalSeats || 0) - (c.enrolled || 0)), 0);
        const activeCourses = courses.filter(c => ((c.totalSeats || 0) - (c.enrolled || 0)) > 0).length;

        return {
            total: courses.length,
            active: activeCourses,
            totalSeats: totalSeats,
            availableSeats: availableSeats,
        };
    }, [courses]);


    // Filter and search courses
    const filteredCourses = useMemo(() => {
        let result = courses;

        // 1. Department Filter
        if (filterDept !== 'All Departments') {
            result = result.filter(course => course.department === filterDept);
        }

        // 2. Search Term Filter
        if (searchTerm.trim()) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            result = result.filter(course =>
                (course.code || '').toLowerCase().includes(lowerSearchTerm) ||
                (course.name || '').toLowerCase().includes(lowerSearchTerm) ||
                (course.instructor || '').toLowerCase().includes(lowerSearchTerm)
            );
        }

        // Client-side sort by code
        return result.sort((a, b) => (a.code || '').localeCompare(b.code || ''));
    }, [courses, filterDept, searchTerm]);


    // --- Course Card Component ---

    const CourseCard = ({ course }) => {
        const available = course.totalSeats - course.enrolled;
        const isFull = available <= 0;
        const isLowSeats = available > 0 && available <= 10;

        const statusText = isFull ? 'Full' : (isLowSeats ? 'Low Seats' : 'Active');
        const statusBg = isFull ? 'bg-red-500' : (isLowSeats ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700');
        const availableColor = isFull ? 'text-red-500' : (isLowSeats ? 'text-red-500' : 'text-green-600');
        const lowSeatsBadge = isLowSeats ? <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 ml-2">Low Seats</span> : null;
        
        return (
            <div className="flex justify-between items-start bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-grow space-y-1">
                    {/* Top Row: Code, Credits, Status */}
                    <div className="flex items-center space-x-2">
                        <span className="text-base font-semibold text-gray-800">{course.code}</span>
                        <span className="text-sm text-gray-500">• {course.credits} Credits</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBg}`}>
                            {statusText}
                        </span>
                        {lowSeatsBadge}
                    </div>

                    {/* Course Name */}
                    <p className="text-sm font-medium text-gray-800">{course.name}</p>

                    {/* Details */}
                    <div className="text-xs text-gray-500 grid grid-cols-2 mt-2">
                        <div>Department: <span className="font-medium text-gray-700">{course.department}</span></div>
                        <div className="sm:hidden">Instructor: <span className="font-medium text-gray-700">{course.instructor}</span></div>
                        <div className="col-span-2">Schedule: <span className="font-medium text-gray-700">{course.schedule}</span></div>
                    </div>
                </div>

                {/* Right Side: Instructor, Seats, Actions */}
                <div className="text-right space-y-1 min-w-[200px] hidden sm:block">
                    <p className="text-xs text-gray-500">Instructor: <span className="font-medium text-gray-700">{course.instructor}</span></p>
                    <p className={`text-sm font-semibold ${availableColor}`}>
                        Seats: {available}/{course.totalSeats} available
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
        <div className="p-6 md:p-10 space-y-8 bg-gray-50 min-h-screen font-sans">
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
                            placeholder="Search by code, name, or instructor..."
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
                        {DepartmentOptions.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Course List */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">All Courses ({filteredCourses.length})</h2>
                <p className="text-gray-500 text-sm">Manage course details, schedules, and seat allocation</p>
                <div className="grid grid-cols-1 gap-3">
                    {filteredCourses.length > 0 ? (
                        filteredCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))
                    ) : (
                        <div className="bg-white rounded-xl p-8 text-center text-gray-500 shadow-md border border-gray-100">
                            No courses found matching your search or filter criteria.
                        </div>
                    )}
                </div>
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
                                {/* Course Code */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Course Code</label>
                                    <input type="text" name="code" value={newCourseData.code} onChange={handleFormChange} placeholder="e.g., CSE-3642" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                {/* Course Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Course Name</label>
                                    <input type="text" name="name" value={newCourseData.name} onChange={handleFormChange} placeholder="e.g., Software Engineering" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                {/* Instructor */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Instructor</label>
                                    <input type="text" name="instructor" value={newCourseData.instructor} onChange={handleFormChange} placeholder="e.g., Dr. Smith" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                {/* Credits */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Credits</label>
                                    <input type="number" name="credits" value={newCourseData.credits} onChange={handleFormChange} placeholder="3" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                {/* Department */}
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Department</label>
                                    <select name="department" value={newCourseData.department} onChange={handleFormChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none bg-white">
                                        {DepartmentOptions.slice(1).map(dept => <option key={dept} value={dept}>{dept}</option>)}
                                    </select>
                                </div>
                                {/* Schedule */}
                                <div className="col-span-1 sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Schedule</label>
                                    <input type="text" name="schedule" value={newCourseData.schedule} onChange={handleFormChange} placeholder="e.g., Mon, Wed 10:00 AM - 11:30 AM" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                {/* Total Seats */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Total Seats</label>
                                    <input type="number" name="totalSeats" value={newCourseData.totalSeats} onChange={handleFormChange} placeholder="40" min="1" required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                </div>
                                {/* Enrolled (only shown on edit) */}
                                {isEditing && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1">Enrolled Students</label>
                                        <input type="number" name="enrolled" value={newCourseData.enrolled} onChange={handleFormChange} placeholder="0" min="0" max={newCourseData.totalSeats} required className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                                    </div>
                                )}
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
    );
};

export default CourseManagement;
