import React, { useState } from "react";

const RegisterInstructions = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] md:h-[60vh]">
      <div className="bg-white p-6 rounded-lg shadow-lg md:w-[50vw]">
        <h1 className="text-2xl font-bold mb-4 text-center">Student Registration</h1>
        <div className="mb-6">
          <ol className="list-decimal pl-6 text-gray-700">
            <li>Enter your full name without abbreviations.</li>
            <li>Provide the course or designation as mentioned officially.</li>
            <li>Use a valid college ID that matches your institution&apos;s records.</li>
            <li>Include your university registration number (if applicable).</li>
            <li>Input your year of passing as a four-digit number (e.g., 2025).</li>
            <li>Ensure your email address is valid and includes &quot;@&quot;.</li>
            <li>Provide a 10-digit phone number without spaces or symbols.</li>
            <li>Create a strong password with at least 8 characters, including numbers and symbols.</li>
            <li>Verify your details before submitting to avoid errors.</li>
          </ol>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 w-full"
        >
          Proceed to Registration
        </button>
        {showForm && (
          <div className="mt-6">
            <p className="text-green-600 font-semibold">Follow the instructions carefully while filling the form.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterInstructions;
