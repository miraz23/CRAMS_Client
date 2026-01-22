import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Home from "../pages/Home/Home.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import PrivateRoutes from "../routes/PrivateRoutes/PrivateRoutes.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import Forbidden from "../pages/Forbidden/Forbidden.jsx";
import StdDashboard from "../pages/Dashboard/Student/StdDashboard";
import CourseSelection from "../pages/Dashboard/Student/CourseSelection";
import MySchedule from "../pages/Dashboard/Student/MySchedule";
import Routine from "../pages/Dashboard/Student/Routine";
import RegistrationStatus from "../pages/Dashboard/Student/RegistrationStatus";
import ExtraCreditRequest from "../pages/Dashboard/Student/ExtraCreditRequest";
import ContactAdvisor from "../pages/Dashboard/Student/ContactAdvisor";
import AdminDashboard from "../pages/Dashboard/Admin/Dashboard/AdminDasboard";
import CourseManagement from "../pages/Dashboard/Admin/CourseManagement/CourseManagement";
import SectionManagement from "../pages/Dashboard/Admin/SectionManagement/SectionManagement";
import UserManagement from "../pages/Dashboard/Admin/UserManagement/UserManagement";
import SystemSettings from "../pages/Dashboard/Admin/SystemSettings/SystemSettings";

import AdvisorDashboard from "../pages/Dashboard/Advisor/AdvisorDashboard";
import PendingReviews from "../pages/Dashboard/Advisor/PendingReviews";
import MyStudents from "../pages/Dashboard/Advisor/MyStudents";
import ApprovedCourses from "../pages/Dashboard/Advisor/ApprovedCourses";
import ExtraCreditRequests from "../pages/Dashboard/Advisor/ExtraCreditRequests";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forbidden", element: <Forbidden /> },
    ],
  },
  {
    path: "/admin/dashboard",
    element: (
      <PrivateRoutes allowedRoles={["admin", "super admin"]}>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "coursemanagement",
        element: <CourseManagement />,
      },
      {
        path: "sectionmanagement",
        element: <SectionManagement />,
      },
      {
        path: "usermanagement",
        element: <UserManagement />,
      },
      {
        path: "systemsettings",
        element: <SystemSettings />,
      },
    ],
  },
  {
    path: "/student/dashboard",
    element: (
      <PrivateRoutes allowedRoles={["student"]}>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: <StdDashboard />, // Default dashboard page
      },
      {
        path: "courseselection",
        element: <CourseSelection />,
      },
      {
        path: "myschedule",
        element: <MySchedule />,
      },
      {
        path: "routine",
        element: <Routine />,
      },
      {
        path: "registrationstatus",
        element: <RegistrationStatus />,
      },
      {
        path: "extra-credit-request",
        element: <ExtraCreditRequest />,
      },
      {
        path: "contact-advisor",
        element: <ContactAdvisor />,
      },
    ],
  },
  {
    path: "/advisor/dashboard",
    element: (
      <PrivateRoutes allowedRoles={["advisor"]}>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      {
        index: true,
        element: <AdvisorDashboard />, // Default dashboard page
      },
      {
        path: "pendingreviews",
        element: <PendingReviews />,
      },
      {
        path: "mystudents",
        element: <MyStudents />,
      },
      {
        path: "approvedcourses",
        element: <ApprovedCourses />,
      },
      {
        path: "extra-credit-requests",
        element: <ExtraCreditRequests />,
      },
    ],
  },
]);
