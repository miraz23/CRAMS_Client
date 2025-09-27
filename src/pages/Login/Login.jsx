
import React, { useState } from "react";
import IIUCLogo from "../../assets/IIUC_LOGO.webp";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../service/firebase.config.js";
import Swal from "sweetalert2";
// import IIUC from "../../Assets/images.jpg"

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Swal.fire({
      icon: "success",
      title: "Login successful!",
      showConfirmButton: false,
      timer: 1500
});

      navigate("/"); 
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white border border-gray-200 p-6 items-center">
        {/* University Logo */}
        <div className="flex gap-3 items-center mb-4">
          <img src={IIUCLogo} alt="IIUC Logo" className="w-10 h-10 mb-2" />
          <h1 className="text-center text-2xl font-bold text-[#696969]">
            International Islamic University <br /> Chittagong
          </h1>
        </div>

        {/* Color line */}
        <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 via-red-400 via-purple-400 to-blue-400 rounded-full mb-4"></div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Register
          </Link>
        </div>

        
        <p className="text-xs text-center text-gray-600 mt-4">
          Copyright © 2025 All rights reserved IIUC
        </p>
      </div>
    </div>
  );
};

export default Login;
