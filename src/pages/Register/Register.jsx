// import React, { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../service/firebase.config.js";
// import { useNavigate } from "react-router-dom";

// const Register = () => {
//   // State for form fields
//   const [fullName, setFullName] = useState("");
//   const [studentId, setStudentId] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   // Handle registration
//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       alert("Registration successful!");
//       navigate("/login");
//     } catch (error) {
//       console.error(error.message);
//       alert(error.message);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md bg-white shadow-lg rounded-lg border border-gray-200 p-6">
//         <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//           Student Registration
//         </h2>

//         <form onSubmit={handleRegister} className="space-y-4">
          
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               value={fullName}
//               onChange={(e) => setFullName(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
//               required
//             />
//           </div>

        
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               Student ID
//             </label>
//             <input
//               type="text"
//               placeholder="Enter Your Student ID"
//               pattern="[A-Za-z][0-9]{6}"
//               title="Example: C231261 (CSE)"
//               value={studentId}
//               onChange={(e) => setStudentId(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
//               required
//             />
//           </div>

        
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               University Email
//             </label>
//             <input
//               type="email"
//               placeholder="example@ugrad.iiuc.ac.bd"
//               pattern="[a-zA-Z0-9._%+-]+@ugrad\.iiuc\.ac\.bd"
//               title="Use your IIUC email (e.g., id@ugrad.iiuc.ac.bd)"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
//               required
//             />
//           </div>

          
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-1">
//               Password
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               minLength={6}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
//               required
//             />
//           </div>

          
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;


import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../service/firebase.config.js";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const Register = () => {
  // State for form fields
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // NEW: State for selected role, defaulting to Student
  const [role, setRole] = useState("Student"); 
  const navigate = useNavigate();

  // Tailwind CSS class for the primary blue color (to match the CRAMS login)
  const primaryBlue = "rgb(19, 102, 194)"; 

  // Handle registration
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);

      console.log(`Attempting to register new user as: ${role}`); 
      
      Swal.fire({
        icon: "success",
        title: `Registration successful as ${role}!`,
        showConfirmButton: false,
        timer: 1500
      });
      navigate("/login");
    } catch (error) {
      console.error(error.message);
      alert(error.message); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-lg border border-gray-100 p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            CRAMS Account Registration
          </h2>
          <p className="text-sm text-gray-500">Create your account for Course Registration & Advising.</p>
        </div>

        {/* Role Selection Tabs (Copied from Login.jsx for consistency) */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          {["Student", "Advisor", "Admin"].map((r) => (
            <button
              key={r}
              type="button" // Important: use type="button" to prevent form submission
              className={`flex-1 flex items-center justify-center space-x-1 py-2 rounded-md text-sm font-medium transition ${
                role === r
                  ? "bg-white shadow-sm text-gray-800"
                  : "text-gray-500 hover:bg-gray-200"
              }`}
              onClick={() => setRole(r)}
            >
              {/* Icons: User, User-Group, Shield-Check (placeholders) */}
              <i className={`mr-1 ${r === "Student" ? 'fas fa-user' : r === 'Advisor' ? 'fas fa-user-tie' : 'fas fa-user-shield'}`}></i>
              <span>{r}</span>
            </button>
          ))}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Student ID</label>
            <input
              type="text"
              placeholder="Enter Your Student ID (e.g., C231261)"
              pattern="[A-Za-z][0-9]{6}"
              title="Example: C231261 (Dept letter followed by 6 digits)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">University Email</label>
            <input
              type="email"
              placeholder="id@ugrad.university.edu"
              title="Use your official university email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter your password (min 6 characters)"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          
          <button
            type="submit"
            style={{ backgroundColor: primaryBlue }}
            className="w-full text-white py-2 rounded-md font-semibold hover:opacity-90 transition cursor-pointer"
          >
            Register
          </button>
        </form>
        
        {/* Link back to login */}
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