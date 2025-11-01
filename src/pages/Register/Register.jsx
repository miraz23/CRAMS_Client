import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../service/firebase.config.js";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();
  const primaryBlue = "rgb(19, 102, 194)";

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      Swal.fire({
        icon: "success",
        title: `Registration successful as ${role}!`,
        showConfirmButton: false,
        timer: 1500,
      });

      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">CRAMS Account Registration</h2>
          <p className="text-sm text-gray-500">Create your account for Course Registration & Advising.</p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          {["Student", "Advisor", "Admin"].map((r) => (
            <button
              key={r}
              type="button"
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                role === r
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setRole(r)}
            >
              <i className={`mr-1 ${
                r === "Student" ? "fas fa-user" :
                r === "Advisor" ? "fas fa-user-tie" :
                "fas fa-user-shield"
              }`}></i>
              {r}
            </button>
          ))}
        </div>

        <form onSubmit={handleRegister} className="space-y-4">

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Student ID</label>
            <input
              type="text"
              placeholder="e.g., C231261"
              pattern="[A-Za-z][0-9]{6}"
              title="Example: C231261 (Letter + 6 digits)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">University Email</label>
            <input
              type="email"
              placeholder="id@ugrad.university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Min 6 characters"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            style={{ backgroundColor: primaryBlue }}
            className="w-full text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Register
          </button>
        </form>

        <div className="text-center mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Register;
