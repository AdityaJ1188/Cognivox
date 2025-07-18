import React from "react";

const Resetpasswordmodal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 w-80 relative">
        {/* Close Button */}
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-white">Check your email</h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-300 mb-4">
          We've sent you a password reset link. Please check your email inbox.
        </p>

        <div className="flex justify-center">
          <a href="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Go to Login
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Resetpasswordmodal;
