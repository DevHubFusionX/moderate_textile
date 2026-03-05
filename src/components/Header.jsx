import React, { useState } from 'react';
import { FaWhatsapp, FaBars, FaTimes } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import Logo from './ui/Logo';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <>
      <header className="fixed top-0 w-full bg-gradient-to-r from-white via-green-50/30 to-white backdrop-blur-md shadow-lg border-b border-green-100/50 z-50">
        {/* Decorative top line */}
        <div className="h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-400"></div>

        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo Section with unique styling */}
            <Link to="/" className="group flex items-center space-x-3 relative">
              <div className="relative">
                <div className="absolute -inset-2 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <Logo size="md" className="relative z-10" />
              </div>
              <div className="relative">
                <div className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-green-800 bg-clip-text text-transparent">
                  Moderate's Textile
                </div>
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 group-hover:w-full transition-all duration-300"></div>
              </div>
            </Link>

            {/* Navigation with unique pill design */}
            <nav className="hidden md:flex items-center bg-white/80 backdrop-blur-sm rounded-full px-6 py-2 shadow-md border border-green-100">
              <div className="flex space-x-1">
                <Link to="/" className="relative px-4 py-2 text-gray-700 hover:text-green-700 font-medium transition-all duration-300 rounded-full hover:bg-green-50 group">
                  <span className="relative z-10">Home</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link to="/products" className="relative px-4 py-2 text-gray-700 hover:text-green-700 font-medium transition-all duration-300 rounded-full hover:bg-green-50 group">
                  <span className="relative z-10">Products</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link to="/combos" className="relative px-4 py-2 text-gray-700 hover:text-green-700 font-medium transition-all duration-300 rounded-full hover:bg-green-50 group">
                  <span className="relative z-10">Combos</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
              </div>
            </nav>

            {/* Action buttons with creative styling */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-md border border-green-100">
                <a href="https://wa.me/2347069257877" className="relative p-2 text-green-600 hover:text-white transition-all duration-300 rounded-full group">
                  <div className="absolute inset-0 bg-green-600 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  <FaWhatsapp size={18} className="relative z-10" />
                </a>
                <a href="https://x.com/moderate_ustaz" className="relative p-2 text-black hover:text-white transition-all duration-300 rounded-full group">
                  <div className="absolute inset-0 bg-black rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  <FaXTwitter size={18} className="relative z-10" />
                </a>
              </div>

              {/* Unique mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-green-100 text-gray-700 hover:text-green-700 transition-all duration-300 group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-green-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10">
                  {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Unique Mobile Menu with slide animation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-gradient-to-br from-white via-green-50/30 to-white backdrop-blur-md border-t border-green-200/50 shadow-xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 via-green-600 to-green-400"></div>
            <nav className="px-6 py-6 space-y-2">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 p-3 text-gray-700 hover:text-green-700 font-medium transition-all duration-300 rounded-xl hover:bg-green-50/50 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-green-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                <span className="relative z-10">Home</span>
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 p-3 text-gray-700 hover:text-green-700 font-medium transition-all duration-300 rounded-xl hover:bg-green-50/50 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-green-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                <span className="relative z-10">Products</span>
              </Link>
              <Link
                to="/combos"
                onClick={() => setMobileMenuOpen(false)}
                className="group flex items-center space-x-3 p-3 text-gray-700 hover:text-green-700 font-medium transition-all duration-300 rounded-xl hover:bg-green-50/50 relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 h-full w-1 bg-green-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                <span className="relative z-10">Combos</span>
              </Link>

              <div className="flex justify-center space-x-4 pt-6 mt-6 border-t border-green-200/50">
                <a href="https://wa.me/2347069257877" className="relative p-3 bg-green-50 text-green-600 hover:text-white transition-all duration-300 rounded-full group">
                  <div className="absolute inset-0 bg-green-600 rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  <FaWhatsapp size={20} className="relative z-10" />
                </a>
                <a href="https://x.com/moderate_ustaz" className="relative p-3 bg-gray-50 text-black hover:text-white transition-all duration-300 rounded-full group">
                  <div className="absolute inset-0 bg-black rounded-full scale-0 group-hover:scale-100 transition-transform"></div>
                  <FaXTwitter size={20} className="relative z-10" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/2347069257877" className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-50 animate-pulse">
        <FaWhatsapp size={24} />
      </a>
    </>
  );
};

export default Header;