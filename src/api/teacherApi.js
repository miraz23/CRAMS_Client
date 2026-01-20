import axios from 'axios';
import API_BASE_URL from '../config/api';

// Axios instance pre-configured for teacher/advisor endpoints
const teacherClient = axios.create({
  baseURL: `${API_BASE_URL}/teacher`,
  withCredentials: true,
});

// Advisor Dashboard APIs
export const getAdvisorDashboard = async (params = {}) => {
  const { data } = await teacherClient.get('/advisor/dashboard', { params });
  return data?.data || { summary: {}, urgentReviews: [], recentActivity: [] };
};

export const getPendingReviews = async (params = {}) => {
  const { data } = await teacherClient.get('/advisor/pending-reviews', { params });
  return data?.data || { summary: {}, reviews: [] };
};

export const getMyStudents = async (params = {}) => {
  const { data } = await teacherClient.get('/advisor/my-students', { params });
  return data?.data || { summary: {}, students: [] };
};

export const getStudentDetails = async (studentId, params = {}) => {
  const { data } = await teacherClient.get(`/advisor/students/${studentId}`, { params });
  return data?.data || {};
};

export const getApprovedCourses = async (params = {}) => {
  const { data } = await teacherClient.get('/advisor/approved-courses', { params });
  return data?.data || { summary: {}, courses: [] };
};

// Approve/Reject course registrations
export const approveRegistration = async (registrationId, feedback = '') => {
  const { data } = await teacherClient.post(`/advisor/approve/${registrationId}`, { feedback });
  return data;
};

export const rejectRegistration = async (registrationId, rejectionReason = '') => {
  const { data } = await teacherClient.post(`/advisor/reject/${registrationId}`, { rejectionReason });
  return data;
};

// Bulk approve/reject
export const bulkApproveRegistrations = async (studentId, registrationIds, feedback = '') => {
  const { data } = await teacherClient.post(`/advisor/bulk-approve/${studentId}`, { 
    registrationIds, 
    feedback 
  });
  return data;
};

export const bulkRejectRegistrations = async (studentId, registrationIds, rejectionReason = '') => {
  const { data } = await teacherClient.post(`/advisor/bulk-reject/${studentId}`, { 
    registrationIds, 
    rejectionReason 
  });
  return data;
};

// Extra Credit Request APIs
export const getPendingExtraCreditRequests = async () => {
  const { data } = await teacherClient.get('/advisor/extra-credit-requests/pending');
  return data?.data || [];
};

export const approveExtraCreditRequest = async (requestId, advisorFeedback = '') => {
  const { data } = await teacherClient.post(`/advisor/extra-credit-requests/${requestId}/approve`, {
    advisorFeedback,
  });
  return data;
};

export const rejectExtraCreditRequest = async (requestId, advisorFeedback = '') => {
  const { data } = await teacherClient.post(`/advisor/extra-credit-requests/${requestId}/reject`, {
    advisorFeedback,
  });
  return data;
};
