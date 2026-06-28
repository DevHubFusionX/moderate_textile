import React, { useState, useEffect } from 'react';
import { getProducts } from '../utils/api';
import { cache } from '../utils/cache';
import ProductCard from './ui/ProductCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const RecentlyViewed = ({ currentProduct }) => {
  const [viewedProducts, setViewedProducts] = useState([]);

  useEffect(() => {
    if (!currentProduct || !currentProduct._id) return;

    // Get existing from localStorage
    const storedIds = JSON.parse(localStorage.getItem('recently_viewed_ids') || '[]');

    // Filter out current id if already in list, then add it to the front
    const updatedIds = [
      currentProduct._id,
      ...storedIds.filter((id) => id !== currentProduct._id)
    ].slice(0, 6); // Keep last 6

    localStorage.setItem('recently_viewed_ids', JSON.stringify(updatedIds));

    // Fetch details for these IDs (excluding current product from display)
    const displayIds = updatedIds.filter((id) => id !== currentProduct._id);
    
    if (displayIds.length === 0) {
      setViewedProducts([]);
      return;
    }

    const loadViewedDetails = async () => {
      try {
        let allProducts = cache.get('products');
        if (!allProducts) {
          allProducts = await getProducts();
          if (allProducts && allProducts.length > 0) {
            cache.set('products', allProducts);
          }
        }

        if (Array.isArray(allProducts)) {
          // Map stored displayIds to full products preserving the order
          const mapped = displayIds
            .map((id) => allProducts.find((p) => p._id === id))
            .filter(Boolean);
          setViewedProducts(mapped);
        }
      } catch (err) {
        console.error('Error loading recently viewed:', err);
      }
    };

    loadViewedDetails();
  }, [currentProduct]);

  const scrollLeft = () => {
    const container = document.getElementById('recent-container');
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('recent-container');
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (viewedProducts.length === 0) return null;

  return (
    <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 shadow-sm relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Recently Viewed</h3>
          <p className="text-sm text-gray-500">Products you recently checked out</p>
        </div>
        
        {viewedProducts.length > 4 && (
          <div className="flex space-x-2">
            <button
              onClick={scrollLeft}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-all"
              aria-label="Scroll left"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={scrollRight}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-full transition-all"
              aria-label="Scroll right"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        )}
      </div>

      <div
        id="recent-container"
        className="flex gap-4 overflow-x-auto pb-4 scroll-smooth snap-x scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-100"
        style={{ scrollbarWidth: 'thin' }}
      >
        {viewedProducts.map((product) => (
          <div 
            key={product._id} 
            className="w-[240px] sm:w-[260px] md:w-[280px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;
