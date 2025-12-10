import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Home from "../pages/Home/Home.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import PrivateRoutes from "../routes/PrivateRoutes/PrivateRoutes.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
// Student Pages
import StdDashboard from "../pages/Dashboard/Student/StdDashboard";
import CourseSelection from "../pages/Dashboard/Student/CourseSelection";
import MySchedule from "../pages/Dashboard/Student/MySchedule";
import RegistrationStatus from "../pages/Dashboard/Student/Registrationstatus";

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
      {
        index: true,
        element: (
          <PrivateRoutes>
            <Dashboard></Dashboard>
          </PrivateRoutes>
        ),
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
        path: "registrationstatus",
        element: <RegistrationStatus />,
      },
    ],
  },
]);

