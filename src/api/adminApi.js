import axios from 'axios';
import API_BASE_URL from '../config/api';

const adminClient = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  withCredentials: true,
});

// Auth
export const loginAdmin = (email, password) =>
  adminClient.post('/login', { email, password });

export const logoutAdmin = () => adminClient.post('/logout');

// Dashboard bundles commonly used admin data
export const getDashboardData = async () => {
  const [coursesRes, userOverviewRes, sectionsRes] = await Promise.all([
    adminClient.get('/courses'),
    adminClient.get('/user-management/overview'),
    adminClient.get('/sections'),
  ]);

  return {
    coursesRes,
    userOverviewRes,
    sectionsRes,
  };
};

// Courses
export const listCourses = (params = {}) => adminClient.get('/courses', { params });
export const createCourse = (payload) => adminClient.post('/courses', payload);
export const updateCourse = (id, payload) => adminClient.put(`/courses/${id}`, payload);
export const deleteCourse = (id) => adminClient.delete(`/courses/${id}`);

// Sections
export const listSections = (params = {}) => adminClient.get('/sections', { params });
export const getSection = (id) => adminClient.get(`/sections/${id}`);
export const createSection = (payload) => adminClient.post('/sections', payload);
export const updateSection = (id, payload) => adminClient.put(`/sections/${id}`, payload);
export const deleteSection = (id) => adminClient.delete(`/sections/${id}`);
export const populateSectionsFromStudents = () => adminClient.post('/sections/populate-from-students');
export const updateSectionCourseSchedule = (sectionId, courseId, schedule) =>
  adminClient.put(`/sections/${sectionId}/courses/${courseId}/schedule`, { schedule });

// User management
export const getUserOverview = () => adminClient.get('/user-management/overview');
export const listStudents = () => adminClient.get('/user-management/students');
export const listTeachers = () => adminClient.get('/user-management/teachers');
export const listAdvisors = () => adminClient.get('/user-management/advisors');
export const updateStudent = (id, payload) =>
  adminClient.put(`/user-management/students/${id}`, payload);
export const updateTeacher = (id, payload) =>
  adminClient.put(`/user-management/teachers/${id}`, payload);
export const listAdmins = () => adminClient.get('/');
export const deleteStudent = (id) =>
  adminClient.delete(`/user-management/students/${id}`);
export const deleteTeacher = (id) =>
  adminClient.delete(`/user-management/teachers/${id}`);
export const updateAdmin = (id, payload) =>
  adminClient.put(`/${id}`, payload);
export const deleteAdmin = (id) =>
  adminClient.delete(`/${id}`);

// CSV Upload for Admin Creation
export const uploadAdminCSV = (formData) =>
  adminClient.post('/upload-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// CSV Upload for Student Creation
export const uploadStudentCSV = (formData) =>
  adminClient.post('/upload-student-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// CSV Upload for Teacher Creation
export const uploadTeacherCSV = (formData) =>
  adminClient.post('/upload-teacher-csv', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

// System Settings
export const getSystemSettings = () => adminClient.get('/system-settings');
export const updateSystemSettings = (payload) => adminClient.put('/system-settings', payload);

