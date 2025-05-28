import React from "react";
import { useNavigate } from "react-router-dom";

const FacultyRegisterInstructions = () => {
  const navigate = useNavigate();

  const handleFaculty = () => {
    navigate('/facultyregister');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">Faculty Registration Guide</h1>
        <div className="mb-6 overflow-auto">
          <p className="text-sm md:text-base text-gray-700 mb-2">Please read the instructions below carefully to avoid errors during registration:</p>
          <ol className="list-decimal pl-6 space-y-2 text-sm md:text-base text-gray-700">
            <li>Enter your full name as per official records (avoid using abbreviations).</li>
            <li>Provide your department name (e.g., BCA, BBA, B.COM) accurately.</li>
            <li>Use your valid College ID assigned by the institution.</li>
            <li>Enter your professional email address, ensuring it includes &quot;@&quot; and is active.</li>
            <li>Provide a 10-digit phone number without spaces or symbols.</li>
            <li>Create a strong password with at least 8 characters, combining uppercase letters, numbers, and special symbols.</li>
            <li>Double-check all the details before submitting the form to minimize mistakes.</li>
          </ol>
          <p className="text-sm md:text-base text-gray-700 mt-4">
            If you need assistance, contact the administration team at <strong>faculty.support@college.com</strong>.
          </p>
        </div>
        <div className="text-center">
          <button
            className='bg-[#ffc13b] px-4 py-2 font-bold text-sm md:text-base rounded-full hover:bg-[#e0a932] transition-colors'
            onClick={handleFaculty}
          >
            Faculty Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyRegisterInstructions;

