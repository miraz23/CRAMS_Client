import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../service/firebase.config.js";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // State for form fields
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Student Registration
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

        
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Student ID
            </label>
            <input
              type="text"
              placeholder="Enter Your Student ID"
              pattern="[A-Za-z][0-9]{6}"
              title="Example: C231261 (CSE)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

        
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              University Email
            </label>
            <input
              type="email"
              placeholder="example@ugrad.iiuc.ac.bd"
              pattern="[a-zA-Z0-9._%+-]+@ugrad\.iiuc\.ac\.bd"
              title="Use your IIUC email (e.g., id@ugrad.iiuc.ac.bd)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              required
            />
          </div>

          
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
