import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Alumni Network. All rights reserved.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <ul className="flex flex-col md:flex-row items-center justify-center md:justify-end">
            <li className="md:ml-4">
              <a href="#" className="text-white hover:text-gray-400">Home</a>
            </li>
            <li className="md:ml-4">
              <a href="#" className="text-white hover:text-gray-400">About</a>
            </li>
            <li className="md:ml-4">
              <a href="#" className="text-white hover:text-gray-400">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
