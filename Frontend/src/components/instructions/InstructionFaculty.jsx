import React, { useState } from "react";

const FacultyRegisterInstructions = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-[70vh] md:h-[60vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[50vw]">
        <h1 className="text-2xl font-bold mb-4 text-center">Faculty Registration Guide</h1>
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Please read the instructions below carefully to avoid errors during registration:</p>
          <ol className="list-decimal pl-6 text-gray-700">
            <li>Enter your full name as per official records (avoid using abbreviations).</li>
            <li>Provide your department name (e.g., BCA, BBA, B.COM) accurately.</li>
            <li>Use your valid College ID assigned by the institution.</li>
            <li>Enter your professional email address, ensuring it includes &quot;@&quot; and is active.</li>
            <li>Provide a 10-digit phone number without spaces or symbols.</li>
            <li>Create a strong password with at least 8 characters, combining uppercase letters, numbers, and special symbols.</li>
            <li>Double-check all the details before submitting the form to minimize mistakes.</li>
          </ol>
          <p className="text-gray-700 mt-4">
            If you need assistance, contact the administration team at <strong>faculty.support@college.com</strong>.
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
              You&apos;re ready to begin the registration process. Follow the instructions carefully while filling out the form.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyRegisterInstructions;
