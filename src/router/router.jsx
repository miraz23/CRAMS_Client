import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Navbar from "../Components/shared/Navbar/Navbar.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Home from "../pages/Home/Home.jsx";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout.jsx";
import PrivateRoutes from "../routes/PrivateRoutes/PrivateRoutes.jsx"
import Dashboard from "../pages/Dashboard/Dashboard.jsx"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/admin/dashboard",
    element: 
    <PrivateRoutes>
      <DashboardLayout/>
    </PrivateRoutes>,
    children: [
      {
        index: true,
        element:
        <PrivateRoutes>
          <Dashboard></Dashboard>
        </PrivateRoutes>
      }
    ]
  }
]);
