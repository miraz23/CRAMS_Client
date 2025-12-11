import React from 'react';
import { Link } from 'react-router-dom';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">403</h1>
        <h2 className="text-3xl font-semibold text-gray-700 mb-4">Access Forbidden</h2>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this resource.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Forbidden;

