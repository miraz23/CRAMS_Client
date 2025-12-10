import React from "react";
import useUserRole from "../../hooks/useUserRole/useUserRole";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  MdHome,
  MdPerson,
  MdAssignment,
  MdPayment,
  MdRequestQuote,
  MdGroup,
  MdArticle,
  MdDescription,
  MdPolicy,
  MdSwapHoriz,
  MdSupervisorAccount,
  MdCheckCircle,
  MdEditNote,
} from "react-icons/md";
// import logo from "../../assets/logo.png"
import useAuth from "../../hooks/useAuth/useAuth";
const DashboardLayout = () => {
  const { user } = useAuth();
  const { role, isLoading } = useUserRole();

  const navLinkStyle = ({ isActive }) =>
    `hover:transition-all hover:duration-300 hover:bg-accent ${
      isActive ? "text-blue-800 font-bold" : ""
    }`;

  const links = (
    <>
      {/* student links */}
      {!isLoading && role === "student" && (
        <>
          <aside className="w-64 bg-white shadow-md p-5">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">CRAMS</h2>
            <ul className="space-y-2">
              <li>
                <NavLink to="/student/dashboard" className={navLinkStyle}>
                  <MdHome /> Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/student/dashboard/courseselection"
                  className={navLinkStyle}
                >
                  <FaBook /> Course Selection
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/student/dashboard/myschedule"
                  className={navLinkStyle}
                >
                  <FaCalendarAlt /> My Schedule
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/student/dashboard/registrationstatus"
                  className={navLinkStyle}
                >
                  <FaClipboardList /> Registration Status
                </NavLink>
              </li>
            </ul>
          </aside>
        </>
      )}

      {/* agent links */}

      {/* admin links */}
      {!isLoading && role === "admin" && (
        <>
          {/* <li>
                    <NavLink to="/dashboard/manage-applications" className={navLinkStyle}>
                        <MdDescription className="inline mr-2" /> Manage Applications
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/manage-users" className={navLinkStyle}>
                    <MdSupervisorAccount className="inline mr-2" /> Manage Users
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/manage-policies" className={navLinkStyle}>
                        <MdPolicy className="inline mr-2" /> Manage Policies
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/manage-transactions" className={navLinkStyle}>
                        <MdSwapHoriz className="inline mr-2" /> Manage Transactions
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/dashboard/manage-blogs" className={navLinkStyle}>
                        <MdEditNote className="inline mr-2" /> Manage Blogs
                    </NavLink>
                </li> */}
        </>
      )}
    </>
  );

  return (
    <div className="drawer lg:drawer-open">
      <div className="drawer-content flex flex-col">
        <div className="navbar bg-base-300 w-full  lg:hidden">
          <div className="flex-none lg:hidden"></div>
          <div className="mx-2 flex-1 px-2 text-lg font-bold"></div>
        </div>
        {/* Page content here */}
        <Outlet></Outlet>
      </div>
      <div className="drawer-side">
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center text-lg font-bold">
              {/* <img className="w-10 h-10" src={logo} alt="Logo" /> */}
            </Link>
            <span className={``}>{role}</span>
          </div>
          {links}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
