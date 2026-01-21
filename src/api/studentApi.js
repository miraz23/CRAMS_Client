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

export const addCourseSelection = async (courseId, sectionId) => {
  const { data } = await studentClient.post('/courses/add', { courseId, sectionId });
  return data;
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

export const fetchRoutine = async (params = {}) => {
  const { data } = await studentClient.get('/routine', { params });
  return data?.data || { weeklySchedule: {}, courses: [], summary: {} };
};

// Extra Credit Request APIs
export const createExtraCreditRequest = async (semester, requestedCredits, reason) => {
  const { data } = await studentClient.post('/extra-credit-requests', {
    semester,
    requestedCredits,
    reason,
  });
  return data;
};

export const getMyExtraCreditRequests = async (params = {}) => {
  const { data } = await studentClient.get('/extra-credit-requests', { params });
  return data?.data || [];
};

// Advisor Appointment APIs
export const getMyAdvisor = async () => {
  try {
    const { data } = await studentClient.get('/advisor');
    return data?.data || null;
  } catch (error) {
    // Return null if advisor not found instead of throwing
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const bookAppointment = async (appointmentDate, appointmentTime, reason) => {
  const { data } = await studentClient.post('/appointments', {
    appointmentDate,
    appointmentTime,
    reason,
  });
  return data;
};

export const getMyAppointments = async () => {
  try {
    const { data } = await studentClient.get('/appointments');
    return data?.data || [];
  } catch (error) {
    // Return empty array if appointments not found
    if (error.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

// Get system settings (registration deadline, current semester, etc.)
export const getSystemSettings = async () => {
  try {
    const { data } = await studentClient.get('/system-settings');
    return data?.data || {};
  } catch (error) {
    console.error('Error fetching system settings:', error);
    return {};
  }
};

