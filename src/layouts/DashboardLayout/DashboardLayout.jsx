import React from "react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  // Each page (student/admin) implements its own sidebar
  // This layout just provides the outlet for nested routes
  return <Outlet />;
};

export default DashboardLayout;
