import React from "react";
import Navbar from "../../Components/shared/Navbar/Navbar.jsx";
import Home from "../../pages/Home/Home.jsx";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/login", "/register"];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {!shouldHideNavbar && <Navbar />}
      {/* {<Home />} */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
