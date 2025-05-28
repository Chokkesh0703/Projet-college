import React from "react";
import { useNavigate } from "react-router-dom";

const RegisterInstructions = () => {
  const navigate = useNavigate();
  const handleStudent = () => {
    navigate('/register');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-4">
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-full max-w-4xl mx-4">
        <h1 className="text-xl md:text-2xl font-bold mb-4 text-center">Student Registration</h1>
        <div className="mb-6 overflow-auto">
          <ol className="list-decimal pl-6 space-y-2 text-sm md:text-base text-gray-700">
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
        <div className="text-center">
          <button
            className='bg-[#ffc13b] px-4 py-2 font-bold text-sm md:text-base rounded-full hover:bg-[#e0a932] transition-colors'
            onClick={handleStudent}
          >
            Student Registration
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterInstructions;

// import React from "react";
// import { useNavigate } from "react-router-dom";

// const RegisterInstructions = () => {
//   const navigate = useNavigate();
//   const handleStudent = () => {
//     navigate('/register')
//   }

//   return (
//     <div className="flex flex-col items-center justify-center h-[70vh] md:h-[60vh]">
//       <div className="bg-white p-6 rounded-lg shadow-lg md:w-[50vw]">
//         <h1 className="text-2xl font-bold mb-4 text-center">Student Registration</h1>
//         <div className="mb-6">
//           <ol className="list-decimal pl-6 text-gray-700">
//             <li>Enter your full name without abbreviations.</li>
//             <li>Provide the course or designation as mentioned officially.</li>
//             <li>Use a valid college ID that matches your institution&apos;s records.</li>
//             <li>Include your university registration number (if applicable).</li>
//             <li>Input your year of passing as a four-digit number (e.g., 2025).</li>
//             <li>Ensure your email address is valid and includes &quot;@&quot;.</li>
//             <li>Provide a 10-digit phone number without spaces or symbols.</li>
//             <li>Create a strong password with at least 8 characters, including numbers and symbols.</li>
//             <li>Verify your details before submitting to avoid errors.</li>
//           </ol>
//         </div>
//         <button className='bg-[#ffc13b] pr-2 pl-2 font-bold text-[12px] md:text-[15px] rounded-full h-10' onClick={handleStudent}>Student Login</button>
//       </div>
//     </div>
//   );
// };

// export default RegisterInstructions;
