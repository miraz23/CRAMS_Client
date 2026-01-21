import React from "react";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const location = useLocation();

  return (
    <div>
      {/* Navbar removed globally */}
      <Outlet />
    </div>
  );
};

export default RootLayout;
