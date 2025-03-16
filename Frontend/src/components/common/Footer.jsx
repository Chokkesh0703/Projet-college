import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Left side - Text */}
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Alumni Network. All rights reserved.</p>
        </div>

        {/* Right side - Navigation Links */}
        <div className="mt-4 md:mt-0">
          <ul className="flex flex-col md:flex-row items-center justify-center md:justify-end space-y-2 md:space-y-0 md:space-x-6">
            <li>
              <a href="#" className="text-white hover:text-gray-400 transition-colors duration-300">Home</a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-400 transition-colors duration-300">About</a>
            </li>
            <li>
              <a href="#" className="text-white hover:text-gray-400 transition-colors duration-300">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
