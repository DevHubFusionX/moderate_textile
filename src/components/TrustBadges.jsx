import React from 'react';
import { FaShieldAlt, FaShippingFast, FaComments, FaSync } from 'react-icons/fa';

const TrustBadges = () => {
  const badges = [
    {
      icon: <FaShieldAlt size={22} className="text-green-600" />,
      title: "Quality Guaranteed",
      desc: "Carefully sourced premium textiles"
    },
    {
      icon: <FaShippingFast size={22} className="text-green-600" />,
      title: "Nationwide Delivery",
      desc: "Fast shipping across Nigeria"
    },
    {
      icon: <FaComments size={22} className="text-green-600" />,
      title: "WhatsApp Support",
      desc: "Instant responses & assistance"
    },
    {
      icon: <FaSync size={22} className="text-green-600" />,
      title: "Easy Exchanges",
      desc: "Flexible product return policy"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      {badges.map((badge, idx) => (
        <div 
          key={idx} 
          className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-xs border border-gray-100 transition-all hover:shadow-sm"
        >
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mb-3">
            {badge.icon}
          </div>
          <h4 className="text-sm font-semibold text-gray-800 mb-1">{badge.title}</h4>
          <p className="text-xs text-gray-500">{badge.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default TrustBadges;
