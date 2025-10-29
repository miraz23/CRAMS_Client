import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Navbar from "../Components/shared/Navbar/Navbar.jsx";
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, 
    children: [
      {
        path: "login",
        element: <Login />,    
      },
      {
        path: "register",
        element: <Register />,
      }
    ],
  },
]);
