import React from 'react';
import { Link } from 'react-router-dom';
import home from '../images/home.png';
import profile from '../images/profile.png';
const UserHeader = () => {
  return (
    <header className=" w-full fixed bg-primary shadow-lg  p-4 flex justify-between items-center z-10 ">
      <h1>LEARNLAB</h1>

      <nav className="flex items-center space-x-4">
  <Link to="/">
    <button className="relative">
      <img src={home} alt="Home" className="w-5 h-5" />
    </button>
  </Link>

  <span className="w-px h-5 bg-black"></span> 

  <Link to="/profile">
    <button className="relative">
      <img src={profile} alt="Profile" className="w-5 h-5" />
    </button>
  </Link>

  <Link to="/practice" className="font-popp underline hover:text-gray-200">Practice</Link>
  
</nav>

    </header>
  );
};

export default UserHeader;