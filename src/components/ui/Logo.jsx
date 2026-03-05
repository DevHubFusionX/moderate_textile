import React from 'react';
import { FaWhatsapp, FaTwitter, FaInstagram } from 'react-icons/fa';

const Logo = ({ size = 'md', showDetails = false }) => {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-xs', monogram: 'text-lg' },
    md: { container: 'w-12 h-12', text: 'text-sm', monogram: 'text-xl' },
    lg: { container: 'w-16 h-16', text: 'text-base', monogram: 'text-2xl' },
    xl: { container: 'w-24 h-24', text: 'text-lg', monogram: 'text-4xl' }
  };

  const MonogramIcon = () => (
    <div className={`${sizes[size].container} bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center shadow-lg text-white`}>
      <span className={`${sizes[size].monogram} font-bold tracking-wider`}>
        MT
      </span>
    </div>
  );

  if (!showDetails) {
    return <MonogramIcon />;
  }

  return (
    <div className="text-center">
      <MonogramIcon />
      <div className="mt-3">
        <h1 className={`${sizes[size].text} font-bold text-gray-800 tracking-wider`}>
          MODERATE'S TEXTILE
        </h1>
        <div className="flex justify-center space-x-3 mt-2">
          <a href="https://x.com/moderate_ustaz" className="text-blue-500 hover:text-blue-600 transition-colors">
            <FaTwitter size={14} />
          </a>
          <a href="https://instagram.com/moderates_textile" className="text-pink-500 hover:text-pink-600 transition-colors">
            <FaInstagram size={14} />
          </a>
          <a href="https://wa.me/2347069257877" className="text-green-500 hover:text-green-600 transition-colors">
            <FaWhatsapp size={14} />
          </a>
        </div>
        <p className="text-xs text-gray-500 mt-1">0706 925 7877</p>
      </div>
    </div>
  );
};

export default Logo;