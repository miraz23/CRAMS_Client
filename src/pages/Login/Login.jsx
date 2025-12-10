
// import React, { useState } from "react";
// import IIUCLogo from "../../assets/IIUC_LOGO.webp";
// import { Link, useNavigate } from "react-router-dom";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../service/firebase.config.js";
// import Swal from "sweetalert2";
// // import IIUC from "../../Assets/images.jpg"

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate(); 

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       Swal.fire({
//       icon: "success",
//       title: "Login successful!",
//       showConfirmButton: false,
//       timer: 1500
// });

//       navigate("/"); 
//     } catch (error) {
//       console.error(error.message);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-lg bg-white border border-gray-200 p-6 items-center">
//         {/* University Logo */}
//         <div className="flex gap-3 items-center mb-4">
//           <img src={IIUCLogo} alt="IIUC Logo" className="w-10 h-10 mb-2" />
//           <h1 className="text-center text-2xl font-bold text-[#696969]">
//             International Islamic University <br /> Chittagong
//           </h1>
//         </div>

//         {/* Color line */}
//         <div className="h-1 w-full bg-gradient-to-r from-green-400 via-yellow-400 via-red-400 via-purple-400 to-blue-400 rounded-full mb-4"></div>

//         {/* Login Form */}
//         <form onSubmit={handleLogin} className="space-y-3">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
//             required
//           />
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
//           >
//             Login
//           </button>
//         </form>

//         <div className="text-center mt-4">
//           Don&apos;t have an account?{" "}
//           <Link to="/register" className="text-blue-500 hover:underline">
//             Register
//           </Link>
//         </div>

        
//         <p className="text-xs text-center text-gray-600 mt-4">
//           Copyright © 2025 All rights reserved IIUC
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;


import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../service/firebase.config.js";
import Swal from "sweetalert2";
// import cap from "../../assets/CAP.png"; // Removing logo import as the target image doesn't show it

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  // The primary blue color for buttons and links
  const primaryBlue = "rgb(19, 102, 194)"; 

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);

      // Save role for later usage
      localStorage.setItem("userRole", role);

      Swal.fire({
        icon: "success",
        title: `Login successful as ${role}!`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Navigate based on role
      if (role === "Admin") {
        navigate("/admin/dashboard");
      } else if (role === "Advisor") {
        navigate("/advisor/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      console.error(error.message);
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message,
      });
    }
  };

  // 🔹 Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Enter your email first",
        text: "Please enter your registered email to reset your password.",
      });
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Swal.fire({
        icon: "success",
        title: "Password Reset Email Sent!",
        text: "Check your inbox to reset your password.",
      });
    } catch (error) {
      console.error("Error sending reset email:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 space-y-6">
        
        {/* Header: "Welcome to CRAMS" */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to CRAMS</h1>
          <p className="text-sm text-gray-500">
            Course Registration & Advising Management System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email/Username Input */}
            <input
              type="text" // Changed to type="text" to allow for "Username or Email"
              placeholder="Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />

          {/* Password Input */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 text-base placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />

          {/* Forgot Password Link */}
          <div className="text-right mt-2 mb-4">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-500 font-medium text-sm"
            >
              Forgot Password?
            </button>
          </div>

          {/* Select Role (Radio Buttons) */}
          <div className="space-y-2 pt-2">
            <p className="font-semibold text-gray-700">Select Role</p>
            <div className="flex justify-between items-center">
              {["Student", "Advisor", "Admin"].map((r) => (
                <label key={r} className="inline-flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="role"
                    value={r}
                    checked={role === r}
                    onChange={() => setRole(r)}
                    // Styling for the blue radio button dot
                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-2">{r}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{ backgroundColor: primaryBlue }}
            className="w-full text-white py-2.5 rounded-md font-semibold text-lg hover:opacity-90 transition-all duration-200 cursor-pointer mt-6"
          >
            Login
          </button>
        </form>
        
        {/* Register Link (Removed from final design to match the image, but kept commented) */}
      
     <div className="text-center mt-4">
           Don&apos;t have an account?{" "}
           <Link to="/register" className="text-blue-500 hover:underline">
             Register
          </Link>
        </div> 
        
      </div>
    </div>
  );
};

export default Login;