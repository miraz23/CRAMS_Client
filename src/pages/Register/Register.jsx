// src/pages/Register.jsx
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { createUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');
  const [isLoading, setIsLoading] = useState(false);

  const primaryBlue = 'rgb(19, 102, 194)';

  // ---------- VALIDATION ----------
  const isValidEmail = (e) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(e);
  const isIIUCEmail = (e) => e.toLowerCase().endsWith('@ugrad.iiuc.ac.bd');
  const isValidStudentId = (id) => /^[A-Z][0-9]{6}$/.test(id);

  // ---------- SUBMIT ----------
  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Email
    if (!isValidEmail(email)) {
      Swal.fire({ icon: 'error', title: 'Invalid Email', text: 'Enter a proper email address.' });
      setIsLoading(false);
      return;
    }
    if (!isIIUCEmail(email)) {
      Swal.fire({ icon: 'error', title: 'Wrong Domain', text: 'Use *@ugrad.iiuc.ac.bd' });
      setIsLoading(false);
      return;
    }

    // 2. Student ID (only for Student)
    if (role === 'Student' && !isValidStudentId(studentId)) {
      Swal.fire({ icon: 'error', title: 'Invalid Student ID', text: 'Format: C231272' });
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        email,
        password,
        role,
        fullName,
        studentId: role === 'Student' ? studentId : undefined,
      };

      await createUser(userData);

      // Success
      Swal.fire({
        icon: 'success',
        title: `Registered as ${role}!`,
        text: 'You can now log in.',
        timer: 2000,
        showConfirmButton: false,
      });

      // Redirect to login
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      let msg = err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      
      if (err.response?.status === 400) {
        msg = err.response.data.message || 'Invalid registration data. Please check all fields.';
      } else if (err.response?.status === 409) {
        msg = 'This email or student ID is already registered.';
      }

      Swal.fire({ icon: 'error', title: 'Registration Failed', text: msg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">CRAMS Account Registration</h2>
          <p className="text-sm text-gray-500">Create your account for Course Registration & Advising.</p>
        </div>

        {/* Role Buttons */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          {['Student', 'Advisor', 'Admin'].map((r) => (
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

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="e.g. Farez"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Student ID */}
          {role === 'Student' && (
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Student ID</label>
              <input
                type="text"
                placeholder="e.g. C231272"
                pattern="[A-Z][0-9]{6}"
                title="One uppercase letter + 6 digits"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                className="uppercase w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">University Email</label>
            <input
              type="email"
              placeholder="c231272@ugrad.iiuc.ac.bd"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: primaryBlue }}
            className="w-full text-white py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            {isLoading ? 'Registering...' : `Register as ${role}`}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center mt-4 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;