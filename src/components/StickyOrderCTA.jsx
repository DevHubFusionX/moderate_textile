import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import Button from './ui/Button';

const StickyOrderCTA = ({ productName, price, selectedColor, targetRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // If target (main order button) is NOT intersecting, then show the sticky bar
        setIsVisible(!entry.isIntersecting);
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px', // Trigger a bit earlier
      }
    );

    observer.observe(targetRef.current);

    return () => {
      if (targetRef.current) {
        observer.unobserve(targetRef.current);
      }
    };
  }, [targetRef]);

  const handleOrder = () => {
    const colorText = selectedColor ? ` in ${selectedColor.name}` : '';
    const message = `Hi, I'm interested in ${productName}${colorText} for ${price}`;
    window.open(`https://wa.me/2347069257877?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 shadow-2xl transition-all duration-300 md:hidden flex items-center justify-between gap-4 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-800 truncate">{productName}</h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-bold text-green-600">{price}</span>
          <span className="text-xs text-gray-500">per piece</span>
        </div>
      </div>
      
      <Button
        variant="whatsapp"
        size="md"
        className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center gap-2 text-sm shadow-md"
        icon={<FaWhatsapp size={18} />}
        onClick={handleOrder}
      >
        Order Now
      </Button>
    </div>
  );
};

export default StickyOrderCTA;
