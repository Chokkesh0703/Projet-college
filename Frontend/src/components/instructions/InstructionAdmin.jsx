import React, { useState } from "react";

const AdminRegisterInstructions = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-[70vh] md:h-[60vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg md:w-[50vw]">
        <h1 className="text-2xl font-bold mb-4 text-center">Admin Registration Guide</h1>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Follow these instructions carefully to register as an admin:</p>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>Provide your full name without abbreviations or special characters.</li>
            <li>Enter a valid College ID assigned by your institution.</li>
            <li>Use an official email address that includes &quot;@&quot; and matches your institution&apos;s domain, if required.</li>
            <li>Provide a 10-digit phone number without spaces, dashes, or special symbols.</li>
            <li>Create a strong password with at least 8 characters, combining uppercase letters, lowercase letters, numbers, and special characters.</li>
            <li>Verify all details thoroughly before submitting to avoid delays or errors.</li>
          </ol>
          <p className="text-gray-700 mt-4">
            If you face any issues, contact the support team at <strong>support@collegeadmin.com</strong>.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 w-full"
        >
          Proceed to Registration Form
        </button>
        {showForm && (
          <div className="mt-6">
            <p className="text-green-600 font-semibold">
              You&apos;re all set to complete the registration process. Make sure to follow the instructions!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRegisterInstructions;
