import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Home from "../pages/Home/Home.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import PrivateRoutes from "../routes/PrivateRoutes/PrivateRoutes.jsx";

import AdminDashboard from "../pages/Dashboard/Admin/Dashboard/AdminDasboard.jsx";
import CourseManagement from "../pages/Dashboard/Admin/CourseManagement/CourseManagement.jsx";
import SectionManagement from "../pages/Dashboard/Admin/SectionManagement/SectionManagement.jsx";
import UserManagement from "../pages/Dashboard/Admin/UserManagement/UserManagement.jsx";
import SystemSettings from "../pages/Dashboard/Admin/SystemSettings/SystemSettings.jsx";
import Profile from "../pages/Dashboard/Shared/Profile.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin/dashboard",
    element: (
      <PrivateRoutes>
        <DashboardLayout />
      </PrivateRoutes>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "course-management", element: <CourseManagement /> },
      { path: "section-management", element: <SectionManagement /> },
      { path: "user-management", element: <UserManagement /> },
      { path: "system-settings", element: <SystemSettings /> },
      {path: "profile",element: <Profile/>}
    ],
  },
]);

