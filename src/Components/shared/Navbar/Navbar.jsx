import React from "react";
import iiuc from "../../../assets/IIUC_LOGO.webp";
import caplogo from "../../../assets/CAP.png";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center px-6 py-2 border-b border-gray-300 shadow-2xl">
      {/* for logo */}
      <div className="flex items-center gap-2">
        {/* <img src={iiuc} alt="" className='h-12 w-12'/>
        <p>IIUC</p> */}
        <img src={caplogo} alt="" className="h-14 w-14" />
        <div>
          <p className="text-xl font-bold">CRAMS</p>
          <p className="text-gray-500 font-semibold">
            Course Registration & Advising
          </p>
        </div>
      </div>
      {/* login button */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            navigate("/login");
          }}
          className="bg-green-900 hover:bg-green-600 text-white px-6 py-2 rounded-3xl cursor-pointer"
        >
          Login
        </button>
        {/* ---------- */}
        <button
          // onClick={() => {
          //   navigate("/login");
          // }}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer font-semibold"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Navbar;
