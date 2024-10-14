import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className=" w-full fixed bg-primary shadow-lg  p-4 flex justify-between items-center z-10">
      <h1>LEARNLAB</h1>
      <nav className='space-x-4'>
      <Link to="/about" className="font-popp underline hover:text-gray-200">About Us</Link>

      <Link to="/signin" className="font-popp underline hover:text-gray-200">Sign In</Link>

        <Link to="/signup" className="font-popp underline hover:text-gray-200">Sign Up</Link>


      </nav>
    </header>
  );
};

export default Header;
