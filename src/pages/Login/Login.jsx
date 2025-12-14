import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth/useAuth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useAuth();
  const primaryBlue = "rgb(19, 102, 194)";

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password, role);

      Swal.fire({
        icon: "success",
        title: `Login successful as ${role}!`,
        showConfirmButton: false,
        timer: 1500,
      });

      // Get the actual role from localStorage (may have been updated based on privilege)
      const actualRole = localStorage.getItem('userRole');
      if (actualRole === "admin" || actualRole === "super admin") navigate("/admin/dashboard");
      else if (actualRole === "advisor") navigate("/advisor/dashboard");
      else navigate("/student/dashboard");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Login failed. Please check your credentials.";
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Swal.fire({
        icon: "warning",
        title: "Enter your email first",
        text: "Please enter your registered email to reset your password.",
      });
      return;
    }

    // TODO: Implement password reset via backend API
    Swal.fire({
      icon: "info",
      title: "Password Reset",
      text: "Please contact your administrator to reset your password.",
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Welcome to CRAMS</h1>
          <p className="text-sm text-gray-500">
            Course Registration & Advising Management
          </p>
          {/* Role Buttons */}
          <div className="flex bg-gray-100 p-1 rounded-lg my-4">
            {["Student", "Teacher", "Admin"].map((r) => (
              <button
                key={r}
                type="button"
                disabled={isLoading}
                onClick={() => setRole(r)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  role === r ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:bg-gray-200'
                }`}
              >
                <i
                  className={`mr-1 ${
                    r === 'Student' ? 'fas fa-user' :
                    r === 'Advisor' ? 'fas fa-user-tie' :
                    'fas fa-user-shield'
                  }`}
                ></i>
                {r}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <label 
           className="block text-gray-700 text-sm font-medium mb-1"
           >{role === "Student" ? "Student ID" : "Email"}</label>
          <input
            type="text"
            placeholder={role === "Student" ? "e.g. C231272" : "Email"}
            value={email}
            onChange={(e) => setEmail(role === "Student" ? e.target.value.toUpperCase().trim() : e.target.value.trim())}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />
          <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            required
          />

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: primaryBlue }}
            className="w-full text-white py-2.5 rounded-md font-semibold text-lg hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

