// frontend/src/components/Navbar.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
//Just Updated for Heroicons v2

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const authLinks = (
    <div className='flex items-center space-x-4'>
      <span className='text-text-light'>Welcome, {user?.username}</span>
      <Link
        to='/dashboard'
        className='text-primary hover:text-blue-700 transition duration-300'
      >
        Dashboard
      </Link>
      <Link
        to='/tasks'
        className='text-primary hover:text-blue-700 transition duration-300'
      >
        Tasks
      </Link>
      <button
        onClick={logout}
        className='bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition duration-300'
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className='flex space-x-4'>
      <Link
        to='/login'
        className='bg-primary text-white px-3 py-2 rounded hover:bg-blue-700 transition duration-300'
      >
        Login
      </Link>
      <Link
        to='/register'
        className='bg-primary text-white px-3 py-2 rounded hover:bg-blue-700 transition duration-300'
      >
        Register
      </Link>
    </div>
  );

  return (
    <nav className='bg-white shadow-custom py-4'>
      <div className='container mx-auto px-4 flex justify-between items-center'>
        <Link to='/' className='text-2xl font-bold text-primary'>
          Task Manager
        </Link>
        {/* Desktop Navigation Links */}
        <div className='hidden md:flex'>
          {isAuthenticated ? authLinks : guestLinks}
        </div>
        {/* Hamburger Icon for Mobile */}
        <button className='md:hidden' onClick={() => setIsMobileMenuOpen(true)}>
          <Bars3Icon className='h-6 w-6 text-primary' /> {/* Updated for v2 */}
        </button>
      </div>
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-4'>
          <button
            className='absolute top-4 right-4'
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <XMarkIcon className='h-6 w-6 text-primary' />{" "}
            {/* Updated for v2 */}
          </button>
          {isAuthenticated ? (
            <>
              <span className='text-text-light text-lg'>
                Welcome, {user?.username}
              </span>
              <Link
                to='/dashboard'
                className='text-primary text-lg hover:text-blue-700 transition duration-300'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to='/tasks'
                className='text-primary text-lg hover:text-blue-700 transition duration-300'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Tasks
              </Link>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to='/register'
                className='bg-primary text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
