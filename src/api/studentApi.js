import axios from 'axios';
import API_BASE_URL from '../config/api';

// Axios instance pre-configured for student endpoints
const studentClient = axios.create({
  baseURL: `${API_BASE_URL}/student`,
  withCredentials: true,
});

export const fetchAvailableCourses = async (params = {}) => {
  const { data } = await studentClient.get('/courses/available', { params });
  return data?.data || [];
};

export const fetchSelectedCourses = async () => {
  const { data } = await studentClient.get('/courses/selected');
  return data?.data || { courses: [], summary: {} };
};

export const addCourseSelection = async (courseId) => {
  await studentClient.post('/courses/add', { courseId });
};

export const removeCourseSelection = async (courseId) => {
  await studentClient.delete(`/courses/remove/${courseId}`);
};

export const submitCoursesForApproval = async () => {
  await studentClient.post('/courses/submit');
};

export const fetchRegistrationStatus = async (params = {}) => {
  const { data } = await studentClient.get('/courses/status', { params });
  return data?.data || { registrations: [], summary: {} };
};

export const fetchSchedule = async (params = {}) => {
  const { data } = await studentClient.get('/schedule', { params });
  return data?.data || { weeklySchedule: {}, courses: [], summary: {} };
};

