import React from "react";
import Navbar from "../../Components/shared/Navbar/Navbar.jsx";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      <Outlet />
    </div>
  );
};

export default RootLayout;
